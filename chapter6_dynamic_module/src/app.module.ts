import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

/**
 * NestJS는 dotenv를 내부적으로 활용하는 @nestjs/config 패키지를 제공한다.
 * 이를 이용해 ConfigModule을 동적으로 생성할 수 있다.
 * ConfigModule의 forRoot()는 소비 모듈이 원하는 옵션값을 전달받아
 * DynamicModule를 return 하는 정적 method다.
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      /**
       * dotenv 파일이 dist로 out될 수 있도록
       * nest-cli.json 파일에서 asset 옵션 추가했다.
       * 그래서 런타임 때 config/env 딕셔너리에서 직접 가져올 수 있게 되었다.
       */
      // envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : process.env.NODE_ENV === 'stage' ? '.stage.env' : '.development.env',
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig], // ConfigFactory를 지정
      isGlobal: true, // 전역 모듈로 선언
      validationSchema, // 유효성 검사를 위한 검사 객체 지정
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
