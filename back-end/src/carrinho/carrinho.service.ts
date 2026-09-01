import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CarrinhoItem {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

@Injectable()
export class CarrinhoService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(usuarioId: string): Promise<CarrinhoItem[]> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { carrinho: true },
    });
    if (!usuario?.carrinho) return [];
    try {
      const parsed = JSON.parse(usuario.carrinho);
      return Array.isArray(parsed) ? (parsed as CarrinhoItem[]) : [];
    } catch {
      return [];
    }
  }

  async salvar(usuarioId: string, itens: CarrinhoItem[]): Promise<CarrinhoItem[]> {
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { carrinho: JSON.stringify(itens) },
    });
    return itens;
  }

  async limpar(usuarioId: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { carrinho: null },
    });
  }
}
