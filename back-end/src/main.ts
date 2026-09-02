import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

function validarEnv() {
  const obrigatorias = ['DATABASE_URL', 'JWT_SECRET'];
  const faltando = obrigatorias.filter((k) => !process.env[k]);
  if (faltando.length > 0) {
    logger.error(
      `Variáveis de ambiente obrigatórias faltando: ${faltando.join(', ')}`,
    );
    process.exit(1);
  }
  if (
    !process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY.includes('SEU_SECRET_KEY_AQUI')
  ) {
    logger.warn(
      'STRIPE_SECRET_KEY não configurada — Stripe ficará em modo mock',
    );
  }
  if (
    !process.env.STRIPE_WEBHOOK_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET.includes('SEU_WEBHOOK_SECRET_AQUI')
  ) {
    logger.warn('STRIPE_WEBHOOK_SECRET não configurada — webhook desativado');
  }
}

async function bootstrap() {
  validarEnv();

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // O webhook do Stripe exige o body bruto para validar a assinatura.
  // Registramos um parser raw apenas para a rota /webhook/stripe.
  const express = require('express');
  app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Trust proxy para funcionar atrás de Nginx/Load Balancer (1 = 1 proxy)
  const httpAdapter = app.getHttpAdapter().getInstance();
  if (typeof httpAdapter.set === 'function') {
    httpAdapter.set('trust proxy', 1);
  }

  // Segurança: headers HTTP
  app.use(helmet());

  // CORS — aceita múltiplas origens separadas por vírgula
  const corsOrigins = (process.env.FRONT_URL ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = parseInt(process.env.PORT ?? '3333', 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`Backend rodando na porta ${port} (origens: ${corsOrigins.join(', ')})`);
}
void bootstrap();
