import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const natsUrl = configService.get<string>('NATS_URL', 'nats://localhost:4222');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          property: err.property,
          errors: Object.values(err.constraints || {}),
        }));

        return new RpcException({
          statusCode: 400,
          message: formattedErrors[0].errors,
          errors: formattedErrors,
        });
      },
    }),
  );

  logger.log(`Connecting to NATS at ${natsUrl}`);

  await app.listen();
  logger.log('Products microservice is running');
  await appContext.close();
}

bootstrap();