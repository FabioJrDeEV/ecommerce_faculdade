import { Injectable, BadRequestException } from '@nestjs/common';
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
      amount: Math.round(item.price * 100),
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

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhookEvent(eventType: string, session: any) {
    if (eventType === 'checkout.session.completed') {
      await this.createOrderFromSession(session);
    }
  }

  async finalizarPedido(
    userId: string,
    items: CheckoutItem[],
    stripeSessionId?: string,
  ) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Itens do pedido são obrigatórios');
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const pedido = await this.prisma.pedido.create({
      data: {
        usuarioId: userId,
        total,
        stripeSessionId: stripeSessionId ?? null,
        status: 'pago',
        itens: {
          create: items.map((item) => ({
            produtoId: item.id,
            nome: item.name,
            preco: item.price,
            quantidade: item.quantity,
          })),
        },
      },
      include: { itens: true },
    });

    return pedido;
  }

  private async createOrderFromSession(session: any) {
    const userId = session.metadata?.userId;
    const itemsJson = session.metadata?.items;

    if (!userId || !itemsJson) return;

    let items: Array<{ id: string; quantity: number; name: string; price: number }> = [];
    try {
      items = JSON.parse(itemsJson);
    } catch {
      return;
    }

    const total = session.amount_total ? session.amount_total / 100 : 0;

    await this.prisma.pedido.upsert({
      where: { stripeSessionId: session.id },
      update: {},
      create: {
        usuarioId: userId,
        total,
        stripeSessionId: session.id,
        status: 'pago',
        itens: {
          create: items.map((item) => ({
            produtoId: item.id,
            nome: item.name ?? '',
            preco: item.price ?? 0,
            quantidade: item.quantity,
          })),
        },
      },
    });
  }
}
