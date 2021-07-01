import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

import {natsSub} from './nats/nats';

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

  let natsConnected: boolean = false;
  let natsInterval = null;

  if (!natsConnected) {
    natsInterval = setInterval(async () => {
      natsConnected = await natsSub();

      console.info('natsConnected ---', natsConnected);

      if (natsConnected) {
        console.info('natsInterval close0 ---', natsConnected);
        clearInterval(natsInterval);
      }
    }, 10000);
  } else {

    console.info('natsInterval close1 ---', natsConnected);

    clearInterval(natsInterval);
  }

  await app.listen(
      // tslint:disable-next-line:no-console
      () => console.log(`Microservice is listening on port ${process.env.APP_PORT}`),
  );
}
bootstrap();
