import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe | null = null;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey || secretKey.includes('SEU_SECRET_KEY_AQUI')) {
      this.logger.warn(
        'STRIPE_SECRET_KEY não configurada — usando modo mock',
      );
      this.stripe = null;
      return;
    }

    try {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2026-07-29.dahlia' as Stripe.LatestApiVersion,
      });
      this.logger.log('Stripe inicializado com sucesso');
    } catch (err) {
      this.logger.error('Falha ao inicializar Stripe', err as Error);
      this.stripe = null;
    }
  }

  async createCheckoutSession(params: {
    lineItems: Array<{ name: string; amount: number; quantity: number }>;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string; url: string | null }> {
    if (!this.stripe) {
      // Modo mock para desenvolvimento sem chaves reais
      return {
        id: 'mock_session_' + Date.now(),
        url: `${params.successUrl}&mock=true`,
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: params.lineItems.map((item) => ({
        price_data: {
          currency: 'brl',
          product_data: { name: item.name },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });

    return { id: session.id, url: session.url };
  }

  constructEvent(
    payload: Buffer | string,
    sig: string,
    webhookSecret: string,
  ): Stripe.Event {
    if (!this.stripe) {
      throw new Error('Stripe não configurado');
    }
    return this.stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  }
}
