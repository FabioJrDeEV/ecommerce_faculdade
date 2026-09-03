import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto, RegistrarDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async registrar(dados: RegistrarDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { email: dados.email },
    });
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hash = await bcrypt.hash(dados.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: hash,
      },
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  }

  async login(dados: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dados.email },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }
}
