import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  loginSchema,
  registrarSchema,
  type LoginDto,
  type RegistrarDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async registrar(dados: RegistrarDto) {
    const body = registrarSchema.parse(dados);

    const existente = await this.prisma.usuario.findUnique({
      where: { email: body.email },
    });
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hash = await bcrypt.hash(body.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: body.nome,
        email: body.email,
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
    const body = loginSchema.parse(dados);

    const usuario = await this.prisma.usuario.findUnique({
      where: { email: body.email },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(body.senha, usuario.senha);
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
