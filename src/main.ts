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
  await app.listen(
      // tslint:disable-next-line:no-console
      () => console.log(`Microservice is listening on port ${process.env.APP_PORT}`),
  );
}
bootstrap();
