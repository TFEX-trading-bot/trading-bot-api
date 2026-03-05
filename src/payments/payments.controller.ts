import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscribeDto } from '../users/dto/subscribe.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('qr')
  async generateQr(@Request() req, @Body() body: SubscribeDto) {
    return this.paymentsService.createQrPayment(req.user.userId, body.subscriptionId);
  }

  @Post('webhook')
  async webhook(@Body() payload: any) {
    // This endpoint is called by the Payment Gateway
    await this.paymentsService.handleWebhook(payload);
    return { status: 'ok' };
  }
}