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

  async handleWebhook(payload: any) {
    // Omise sends an event object
    if (payload.object !== 'event' || !payload.data) return;

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