import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { logger3 } from './middleware/logger3.middleware';
import { OrmConfigService } from './config/orm-config.service';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {
  await makeOrmConfig();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  // 전역으로 인터셉터 적용
  app.useGlobalInterceptors(
    // new LoggingInterceptor(),
    new TransformInterceptor(),
  );

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
