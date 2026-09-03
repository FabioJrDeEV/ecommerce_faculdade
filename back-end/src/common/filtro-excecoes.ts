import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class FiltroExcecoes implements ExceptionFilter {
  private readonly logger = new Logger(FiltroExcecoes.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, mensagem } = this.extrair(exception);

    // Loga o erro original no servidor (para debug), sem expor ao cliente
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else if (process.env.NODE_ENV !== 'production') {
      this.logger.warn(`${request.method} ${request.url} -> ${status}: ${mensagem}`);
    }

    response.status(status).json({
      statusCode: status,
      message: mensagem,
    });
  }

  /**
   * Extrai status HTTP e mensagem amigável de qualquer exceção.
   * Para erros do servidor (>=500), sempre retorna mensagem genérica.
   */
  private extrair(exception: unknown): { status: number; mensagem: string } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const mensagem = this.mensagemDoHttp(exception);
      return { status, mensagem: this.sanitizar(status, mensagem) };
    }

    // ZodError (caso algum serviço ainda use Zod)
    if (this.ehZodError(exception)) {
      const erros = (exception as any).issues ?? (exception as any).errors ?? [];
      const mensagens = erros
        .map((e: any) => e?.message)
        .filter((m: unknown): m is string => typeof m === 'string' && m.length > 0);
      return {
        status: HttpStatus.BAD_REQUEST,
        mensagem:
          mensagens.length > 0 ? mensagens.join(', ') : 'Dados inválidos',
      };
    }

    // Qualquer outra exceção: erro interno genérico
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, mensagem: 'Erro interno do servidor' };
  }

  private ehZodError(exception: unknown): boolean {
    if (!exception || typeof exception !== 'object') return false;
    const e = exception as { name?: string; issues?: unknown; errors?: unknown };
    return (
      e.name === 'ZodError' ||
      Array.isArray(e.issues) ||
      Array.isArray(e.errors)
    );
  }

  private mensagemDoHttp(exception: HttpException): string {
    const payload = exception.getResponse();
    if (typeof payload === 'string') return payload;
    if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;
      if (typeof obj.message === 'string') return obj.message;
      if (Array.isArray(obj.message) && obj.message.length > 0) {
        return obj.message
          .filter((m): m is string => typeof m === 'string')
          .join(', ');
      }
      if (typeof obj.error === 'string') return obj.error;
    }
    return exception.message || 'Erro na requisição';
  }

  /**
   * Para 4xx: mantém a mensagem (já é amigável).
   * Para 5xx: sempre genérico.
   * Filtra mensagens técnicas que vazaram (Prisma, Nest, query, etc).
   */
  private sanitizar(status: number, mensagem: string): string {
    if (status >= 500) return 'Erro interno do servidor';

    const lower = mensagem.toLowerCase();
    const termosTecnicos = [
      'prisma',
      'nestjs',
      'queryfailed',
      'database',
      'stacktrace',
      'undefined is not',
      'is not a function',
      'is not defined',
      'cannot read',
      'the string did not match',
      'expected pattern',
      'invalid input:',
      'throttlerexception',
      'exception:',
    ];
    for (const termo of termosTecnicos) {
      if (lower.includes(termo)) {
        return this.mensagemPadrao(status);
      }
    }

    return mensagem;
  }

  private mensagemPadrao(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Dados inválidos';
      case HttpStatus.UNAUTHORIZED:
        return 'Credenciais inválidas';
      case HttpStatus.FORBIDDEN:
        return 'Acesso negado';
      case HttpStatus.NOT_FOUND:
        return 'Recurso não encontrado';
      case HttpStatus.CONFLICT:
        return 'Conflito de dados';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Dados inválidos';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Muitas requisições. Tente novamente em instantes.';
      default:
        return 'Erro na requisição';
    }
  }
}
