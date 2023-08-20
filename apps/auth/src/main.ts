import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('Auth', true));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = app.get<ConfigService>(ConfigService);
  await app.startAllMicroservices();
  await app.listen(config.get<number>('PORT'));
}
bootstrap();
