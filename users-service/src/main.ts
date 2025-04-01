import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const formattedErrors = errors.map(err => ({
        property: err.property,
        errors: Object.values(err.constraints || {}),
      }));

      return new RpcException({
        statusCode: 400,
        message: formattedErrors[0].errors,
        errors: formattedErrors,
      });
    }
  }));

  const configService = app.get(ConfigService);
  const natsUrl = configService.get<string>('NATS_URL', 'nats://localhost:4222');
  logger.log(`Connecting to NATS at ${natsUrl}`);

  await app.listen();
  logger.log('Users microservice is running');
}
bootstrap();