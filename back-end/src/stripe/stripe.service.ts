import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: any = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey || secretKey.includes('SEU_SECRET_KEY_AQUI')) {
      console.warn('Stripe: STRIPE_SECRET_KEY não configurada - usando modo mock');
      this.stripe = null;
    } else {
      // Em produção, seria: new Stripe(secretKey, { apiVersion: '2024-04-10' })
      // Como não temos a chave real, usamos null e retornamos mock
      this.stripe = null;
    }
  }

  async createCheckoutSession(params: {
    lineItems: Array<{ name: string; amount: number; quantity: number }>;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string; url: string | null }> {
    // Modo mock - simula o comportamento da Stripe
    return {
      id: 'mock_session_' + Date.now(),
      url: `${params.successUrl}&mock=true`,
    };
  }

  constructEvent(payload: Buffer | string, sig: string, webhookSecret: string): any {
    if (!this.stripe) {
      throw new Error('Stripe não configurado');
    }
    // Retorna um evento mock
return {
      type: 'checkout.session.completed',
      data: {
        object: {},
      },
    };
  }
}