import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { logger3 } from './logger/logger3.middleware';
import { OrmConfigService } from './config/orm-config.service';

async function bootstrap() {
  await makeOrmConfig();

  const app = await NestFactory.create(AppModule);

  // looger3 middleware를 전역으로 설정
  app.use(logger3);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}

async function makeOrmConfig() {
  const configService = new OrmConfigService(process.env);
  const typeOrmConfig = configService.getTypeOrmConfig();

  if (fs.existsSync('ormconfig.json')) {
    fs.unlinkSync('ormconfig.json');
  }

  fs.writeFileSync('ormconfig.json', JSON.stringify(typeOrmConfig, null, 2));
}

bootstrap();
