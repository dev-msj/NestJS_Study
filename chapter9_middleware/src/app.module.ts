import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // TypeORM이 자동으로 인식할 entity class 경로
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      // 서비스 구동 시 소스 코드 기반으로 DB Schema 동기화 여부
      // true면 서비스가 시작될 때 자동으로 테이블 생성. 미리 만들어 놓으면 Error 남.
      // synchronize: process.env.DB_SYNCHRONIZE === 'true',
      synchronize: false,

      // 연결 재시도 횟수. default: 10
      // retryAttempts: 10,

      // 재시도 간의 지연 시간(ms). default: 3000
      // retryDelay: 3000,

      // 에러가 났을 때, 인수 err를 받아서 연결을 시도할지 판단하는 함수.
      // toRetry: (err: any) => false,

      // 엔티티를 자동 로드할지 여부
      // autoLoadEntities: false,

      //연결을 재시도할 때 verbose 레벨로 에러 메시지를 출력할지 여부.
      // verbose -> 상세 메시지
      // verboseRetryLog: false,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
