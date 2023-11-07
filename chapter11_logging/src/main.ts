import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { logger3 } from './middleware/logger3.middleware';
import { OrmConfigService } from './config/orm-config.service';
import { MyLogger } from './logger/my-logger.service';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities,
} from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  await makeOrmConfig();

  const app = await NestFactory.create(AppModule, {
    // 내장 로거 비활성화
    // logger: false,

    // 실행 환경에 따른 로그 레벨 지정
    // 로그 레벨을 하나만 설정하면 모든 레벨의 로그 출력
    // logger:
    //   process.env.NODE_ENV === 'production'
    //     ? ['error', 'warn', 'log']
    //     : ['error', 'warn', 'log', 'verbose', 'debug'],

    // 부트스트래핑을 포함한 모든 nest 로거를 winston 로거로 대체
    logger: WinstonModule.createLogger({
      // log 옵션 설정
      transports: [
        new winston.transports.Console({
          // log 레벨을 개발 환경에 따라 다르게 설정
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            // 로그를 남긴 시각을 표기
            winston.format.timestamp(),
            // 로그 출저와 읽기 쉽도록 pretty 옵션을 설정
            utilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  // 커스텀 로거를 전역으로 설정한다.
  // app.useLogger(app.get(MyLogger));

  // nest에 내장된 LoggerService를 구현한 윈스톤 로거를 전역으로 설정한다.
  // 이를 통해 시스템 출력 로그를 커스터마이징 할 수 있다.
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

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
