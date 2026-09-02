import { Controller, Post, Req, Res, HttpCode, HttpStatus, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';
import { CheckoutService } from '../checkout/checkout.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly stripe: StripeService,
    private readonly checkoutService: CheckoutService,
    private readonly config: ConfigService,
  ) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  async handleStripeWebhook(
    @Req() req: any,
    @Res() res: any,
  ) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret || webhookSecret.includes('SEU_WEBHOOK_SECRET_AQUI')) {
      return res.status(500).json({ error: 'Webhook secret não configurado' });
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // O bodyParser foi desativado globalmente e registramos um parser raw
    // apenas para esta rota em main.ts. Aqui recebemos o Buffer.
    let event;
    try {
      event = this.stripe.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    try {
      await this.checkoutService.handleWebhookEvent(event.type, event.data.object);
    } catch (err) {
      console.error('Webhook handler error:', err);
      return res.status(500).json({ error: 'Webhook handler failed' });
    }

    return res.json({ received: true });
  }
}
