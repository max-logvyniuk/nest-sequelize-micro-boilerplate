import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

async function bootstrap() {

  // tslint:disable-next-line:no-console
  console.info('App port', process.env.APP_PORT);

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.APP_HOST,
      port: Number(process.env.APP_PORT),
      retryAttempts: 10,
      retryDelay: 5000,
    },
  });
  // tslint:disable-next-line:no-console
  await app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
