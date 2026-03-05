import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Injectable()
export class UsersService {
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

  async subscribe(userId: number, subscriptionId: number): Promise<User> {
    // 1. ค้นหา User และ Subscription ที่ต้องการ
    const user = await this.findOne(userId);
    const subscription = await this.subscriptionRepository.findOne({ where: { id: subscriptionId } });

    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${subscriptionId} not found`);
    }

    // 2. คำนวณวันเริ่มต้นและวันสิ้นสุด
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscription.duration);

    // 3. อัปเดตข้อมูล Subscription ของ User
    user.subscription = subscription;
    user.subscriptionStartDate = startDate;
    user.subscriptionEndDate = endDate;

    return this.userRepository.save(user);
  }
}
