import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto as Partial<User>);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['bots'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['bots', 'subscription'] });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const merged = this.userRepository.merge(user, updateUserDto as Partial<User>);
    return this.userRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const res = await this.userRepository.delete({ id });
    if (res.affected === 0) throw new NotFoundException(`User with id ${id} not found`);
  }

  /**
   * สมัครหรือต่ออายุ Subscription ให้กับ User
   * - หากเป็น Subscription ใหม่ จะเริ่มนับจากปัจจุบัน
   * - หากเป็นการต่ออายุ จะบวกเพิ่มจากวันหมดอายุเดิม
   */
  async subscribe(userId: number, subscriptionId: number): Promise<User> {
    // 1. ค้นหา User และ Subscription ที่ต้องการ
    const user = await this.findOne(userId);
    const subscription = await this.subscriptionRepository.findOne({ where: { id: subscriptionId } });
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${subscriptionId} not found`);
    }

    // 2. คำนวณวันสิ้นสุดใหม่ (จัดการกรณีต่ออายุ)
    const now = new Date();
    // ถ้ามี subscription ที่ยังไม่หมดอายุ ให้ใช้เป็นวันเริ่มต้นในการคำนวณ
    // ถ้าไม่มี หรือหมดอายุไปแล้ว ให้ใช้เวลาปัจจุบัน
    const calculationStartDate =
      user.subscriptionEndDate && user.subscriptionEndDate > now
        ? user.subscriptionEndDate
        : now;

    const endDate = new Date(calculationStartDate);
    endDate.setDate(endDate.getDate() + subscription.duration);

    // 3. อัปเดตข้อมูล Subscription ของ User
    user.subscription = subscription;
    user.subscriptionStartDate = now; // วันที่ทำรายการคือวันนี้
    user.subscriptionEndDate = endDate;

    this.logger.log(`User ${user.email} subscribed to ${subscription.name}. New expiry date: ${endDate.toISOString()}`);

    return this.userRepository.save(user);
  }

  /**
   * Cron Job: ทำงานทุกวันตอนเที่ยงคืนเพื่อตรวจสอบและจัดการ Subscription ที่หมดอายุ
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'handleExpiredSubscriptions',
    timeZone: 'Asia/Bangkok',
  })
  async handleExpiredSubscriptions() {
    this.logger.log('Running cron job: handleExpiredSubscriptions');

    // ค้นหาผู้ใช้ที่วันหมดอายุผ่านไปแล้ว
    const expiredUsers = await this.userRepository.find({
      where: {
        subscriptionEndDate: LessThan(new Date()),
      },
      relations: ['subscription'],
    });

    if (expiredUsers.length === 0) {
      this.logger.log('No users with past subscription end date found.');
      return;
    }

    // ดึงแพ็กเกจพื้นฐาน (Free plan) เพื่อใช้ในการเปลี่ยนกลับ (ID: 1)
    const defaultSub = await this.subscriptionRepository.findOne({ where: { id: 1 } });
    if (!defaultSub) {
      this.logger.error('Default subscription (ID 1) not found. Cannot revert expired users.');
      return;
    }

    for (const user of expiredUsers) {
      // ตรวจสอบว่าผู้ใช้มี subscription อยู่ และไม่ใช่แพ็กเกจพื้นฐานอยู่แล้ว
      if (user.subscription && user.subscription.id !== defaultSub.id) {
        this.logger.log(`Subscription for user ${user.email} (${user.subscription.name}) has expired. Reverting to default plan.`);
        user.subscription = defaultSub;
        user.subscriptionStartDate = null;
        user.subscriptionEndDate = null;
        await this.userRepository.save(user);
      }
    }

    this.logger.log(`Processed ${expiredUsers.length} expired subscriptions.`);
  }
}
