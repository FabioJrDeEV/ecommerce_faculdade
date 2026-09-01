import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AvaliacoesService, type CriarAvaliacaoDto } from './avaliacoes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  criar(
    @Req() req: { user: { id: string } },
    @Body() body: CriarAvaliacaoDto,
  ) {
    return this.avaliacoesService.criar(req.user.id, body);
  }

  @Get()
  listar() {
    return this.avaliacoesService.listar();
  }

  @Get('minhas')
  @UseGuards(JwtAuthGuard)
  minhas(@Req() req: { user: { id: string } }) {
    return this.avaliacoesService.listarPorUsuario(req.user.id);
  }
}
