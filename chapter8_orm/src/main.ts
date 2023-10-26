import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import * as fs from 'fs';

async function bootstrap() {
  /**
   * ormconfig.json을 사용하는 방식은 typeOrm 0.3 버전부터 삭제됐다.
   * 하지만 현업에서 아직 0.2.x 버전을 사용하고 있는 곳이 있을 수 있다.
   * 그럴 땐 아래와 같이 ConfigService를 만들어 ormconfig.json을 생성해주자.
   */
  // await makeOrmConfig();

  const app = await NestFactory.create(AppModule);

  // ValidationPipe를 핸들러에 일일이 지정하지 않고 전역으로 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}

async function makeOrmConfig() {
  const configService = new ConfigService(process.env);
  const typeOrmConfig = configService.getTypeOrmConfig();

  if (fs.existsSync('ormconfig.json')) {
    fs.unlinkSync('ormconfig.json');
  }

  fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(typeOrmConfig, null, 2),
  );
}

bootstrap();
