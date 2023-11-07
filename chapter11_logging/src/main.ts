import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { logger3 } from './logger/logger3.middleware';
import { OrmConfigService } from './config/orm-config.service';

async function bootstrap() {
  await makeOrmConfig();

  const app = await NestFactory.create(AppModule, {
    // 내장 로거 비활성화
    // logger: false,

    // 실행 환경에 따른 로그 레벨 지정
    // 로그 레벨을 하나만 설정하면 모든 레벨의 로그 출력
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'verbose', 'debug'],
  });

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
