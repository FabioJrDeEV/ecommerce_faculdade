import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
    private readonly config: ConfigService,
  ) {}

  async createSession(userId: string, items: CheckoutItem[]) {
    const lineItems = items.map((item) => ({
      name: item.name,
      amount: Math.round(item.price * 100), // converter para centavos
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const successUrl = this.config.get<string>('STRIPE_SUCCESS_URL') ?? 'http://localhost:3000/cart?sucesso=1';
    const cancelUrl = this.config.get<string>('STRIPE_CANCEL_URL') ?? 'http://localhost:3000/cart?cancelado=1';

    const session = await this.stripe.createCheckoutSession({
      lineItems,
      successUrl,
      cancelUrl,
      metadata: {
        userId,
        items: JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity }))),
      },
    });

    return { url: session.url };
  }

  async handleWebhookEvent(eventType: string, session: any) {
    if (eventType === 'checkout.session.completed') {
      await this.createOrderFromSession(session);
    }
  }

  private async createOrderFromSession(session: any) {
    const userId = session.metadata?.userId;
    const itemsJson = session.metadata?.items;

    if (!userId || !itemsJson) return;

    const items = JSON.parse(itemsJson) as Array<{ id: string; quantity: number }>;
    const total = session.amount_total ? session.amount_total / 100 : 0;

    await this.prisma.pedido.create({
      data: {
        usuarioId: userId,
        total,
        stripeSessionId: session.id,
        status: 'pago',
        itens: {
          create: items.map((item) => ({
            produtoId: item.id,
            quantidade: item.quantity,
            nome: '', // será preenchido se necessário via lookup
            preco: 0, // idealmente buscar do produto
          })),
        },
      },
    });
  }
}