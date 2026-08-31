import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { StripeService } from '../stripe/stripe.service';
import { CheckoutService } from '../checkout/checkout.service';

@Module({
  controllers: [WebhookController],
  providers: [StripeService, CheckoutService],
})
export class WebhookModule {}