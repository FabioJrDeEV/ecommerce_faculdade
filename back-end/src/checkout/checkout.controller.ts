import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  async createSession(
    @Req() req: { user: { id: string } },
    @Body() body: { items: CheckoutItem[] },
  ) {
    const { url } = await this.checkoutService.createSession(req.user.id, body.items);
    return { url };
  }

  @Post('finalizar')
  @UseGuards(JwtAuthGuard)
  async finalizar(
    @Req() req: { user: { id: string } },
    @Body() body: { items: CheckoutItem[]; stripeSessionId?: string },
  ) {
    const pedido = await this.checkoutService.finalizarPedido(
      req.user.id,
      body.items,
      body.stripeSessionId,
    );
    return { pedido };
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  test(@Req() req: { user: { id: string } }) {
    return { message: 'Checkout endpoint working', userId: req.user.id };
  }
}
