import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CarrinhoService, type CarrinhoItem } from './carrinho.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get()
  async listar(@Req() req: { user: { id: string } }) {
    const itens = await this.carrinhoService.obter(req.user.id);
    return { itens };
  }

  @Put()
  async atualizar(
    @Req() req: { user: { id: string } },
    @Body() body: { itens: CarrinhoItem[] },
  ) {
    const itens = Array.isArray(body?.itens) ? body.itens : [];
    const salvos = await this.carrinhoService.salvar(req.user.id, itens);
    return { itens: salvos };
  }

  @Delete()
  async limpar(@Req() req: { user: { id: string } }) {
    await this.carrinhoService.limpar(req.user.id);
    return { itens: [] };
  }
}
