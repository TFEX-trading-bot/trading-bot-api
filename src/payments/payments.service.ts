import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction, PaymentStatus } from './payment-transaction.entity';
import { UsersService } from '../users/users.service';
import { Subscription } from '../subscriptions/subscription.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentRepo: Repository<PaymentTransaction>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    private readonly usersService: UsersService,
  ) {}

  async createQrPayment(userId: number, subscriptionId: number) {
    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) throw new NotFoundException('Subscription not found');

    try {
      // Initialize Omise
      const omise = require('omise')({
        publicKey: process.env.OMISE_PUBLIC_KEY,
        secretKey: process.env.OMISE_SECRET_KEY,
      });

      // 1. เช็คว่ามีรายการที่กำลัง Pending อยู่หรือไม่สำหรับแพ็กเกจนี้
      const existingPending = await this.paymentRepo.findOne({
        where: { userId, subscriptionId, status: PaymentStatus.PENDING },
      });

      if (existingPending && existingPending.gatewayTransactionId) {
        // ดึงข้อมูล Charge เดิมจาก Omise เพื่อดึง QR Code เดิมมาแสดง
        const existingCharge = await omise.charges.retrieve(existingPending.gatewayTransactionId);
        
        if (existingCharge && existingCharge.status === 'pending' && existingCharge.source) {
          return {
            transactionId: existingPending.id,
            qrImage: existingCharge.source.scannable_code.image.download_uri,
            qrRaw: existingCharge.source.scannable_code.payload,
            amount: existingPending.amount,
          };
        } else if (existingCharge && existingCharge.status !== 'pending') {
          // หากในระบบ Omise ไม่ได้ pending แล้ว (เช่น หมดอายุ) ให้อัปเดต DB แล้วให้ระบบสร้างใหม่
          existingPending.status = PaymentStatus.FAILED;
          await this.paymentRepo.save(existingPending);
        }
      }

      // Create Charge (PromptPay)
      const charge = await omise.charges.create({
        amount: Math.round(Number(subscription.price) * 100), // Convert to satang
        currency: 'thb',
        source: {
          type: 'promptpay',
        },
      });

      // Create pending transaction
      const transaction = this.paymentRepo.create({
        userId,
        subscriptionId,
        amount: subscription.price, // Ensure Subscription entity has a price field
        status: PaymentStatus.PENDING,
        gatewayTransactionId: charge.id,
      });
      await this.paymentRepo.save(transaction);

      return {
        transactionId: transaction.id,
        qrImage: charge.source.scannable_code.image.download_uri,
        qrRaw: charge.source.scannable_code.payload,
        amount: subscription.price,
      };
    } catch (error) {
      console.error('Omise Error:', error);
      throw new BadRequestException(error.message || 'Payment processing failed');
    }
  }

  // ✅ ดึงประวัติการทำรายการชำระเงินของผู้ใช้งาน
  async getUserPaymentHistory(userId: number) {
    return this.paymentRepo.find({
      where: { userId },
      relations: ['subscription'], // ดึงข้อมูลแพ็กเกจมาแสดงด้วย
      order: { createdAt: 'DESC' }, // เรียงจากล่าสุดไปเก่าสุด
    });
  }

  async handleWebhook(payload: any) {
    // Omise sends an event object
    // แนะนำให้เช็ค payload.key เพื่อให้รับเฉพาะ Event ที่การทำรายการเสร็จสิ้นแล้ว
    if (payload.object !== 'event' || !payload.data || payload.key !== 'charge.complete') return;

    const data = payload.data;

    // Check if it is a charge event
    if (data.object === 'charge') {
      const gatewayTxId = data.id;
      const transaction = await this.paymentRepo.findOne({ where: { gatewayTransactionId: gatewayTxId } });

      if (!transaction) return;
      if (transaction.status === PaymentStatus.SUCCESS) return;

      if (data.status === 'successful') {
        transaction.status = PaymentStatus.SUCCESS;
        await this.paymentRepo.save(transaction);
        await this.usersService.subscribe(transaction.userId, transaction.subscriptionId);
      } else if (data.status === 'failed') {
        transaction.status = PaymentStatus.FAILED;
        await this.paymentRepo.save(transaction);
      }
    }
  }
}