// src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
    },
  });

  const configService = app.get(ConfigService);
  const natsUrl = configService.get<string>('NATS_URL', 'nats://localhost:4222');
  logger.log(`Connecting to NATS at ${natsUrl}`);

  await app.listen();
  logger.log('Products microservice is running');
}
bootstrap();