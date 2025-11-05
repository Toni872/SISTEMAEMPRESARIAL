import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { LoggerService } from '../src/common/logger.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

let cachedApp: express.Application;

async function bootstrap() {
  if (!cachedApp) {
    const server = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      {
        logger: new LoggerService(),
      }
    );

    // Security
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      }),
    );

    // CORS - Permitir todos los orígenes en producción
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['*'];

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(new LoggingInterceptor());

    // API prefix
    app.setGlobalPrefix('api');

    await app.init();
    cachedApp = server;
  }
  return cachedApp;
}

export default async function handler(
  req: express.Request,
  res: express.Response
) {
  const app = await bootstrap();
  return app(req, res);
}

