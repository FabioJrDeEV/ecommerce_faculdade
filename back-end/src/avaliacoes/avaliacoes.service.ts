import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CriarAvaliacaoDto {
  nota: number;
  comentario?: string;
}

@Injectable()
export class AvaliacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(usuarioId: string, dados: CriarAvaliacaoDto) {
    const nota = Number(dados.nota);
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      throw new BadRequestException('A nota deve ser um inteiro entre 1 e 5');
    }
    const comentario =
      typeof dados.comentario === 'string' && dados.comentario.trim().length > 0
        ? dados.comentario.trim()
        : null;

    return this.prisma.avaliacao.create({
      data: {
        usuarioId,
        nota,
        comentario,
      },
      include: {
        usuario: { select: { id: true, nome: true } },
      },
    });
  }

  async listar() {
    return this.prisma.avaliacao.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        usuario: { select: { id: true, nome: true } },
      },
    });
  }

  async listarPorUsuario(usuarioId: string) {
    return this.prisma.avaliacao.findMany({
      where: { usuarioId },
      orderBy: { criadoEm: 'desc' },
    });
  }
}
