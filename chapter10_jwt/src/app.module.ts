import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { UsersController } from './users/users.controller';
import { typeOrmConfig } from './config/typeOrmConfig.service';
import authConfig from './config/authConfig';
import { APP_GUARD } from '@nestjs/core';
import { HandlerRolesGuard } from './auth/handler-roles.guard';
import { ClassRolesGuard } from './auth/class-roles.guard';
import { RolesGuard } from './auth/roles.guard';

/**
 * nestjs 자체 라이브러리 어딘가에 APP_GUARD라는 키워드를 받으면
 * Guard가 전역으로 선언될 수 있도록 하는 것 같다.
 * nestjs가 제공하는 상수가 아닌 스트링 값으로 'APP_GUARD'를 넘겨도
 * 동일하게 적용된다.
 * 반면 APP_GUARD가 아닌 다른 문자열을 넘기면 Guard가 동작하지 않는다.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.${process.env.NODE_ENV}.env`,
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    // guard에 종속성 주입을 사용하기 위한 custom provider
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   // 라우트 핸들러에 가드 적용
    //   provide: APP_GUARD,
    //   useClass: HandlerRolesGuard,
    // },
    // {
    //   // 클래스에 가드 적용
    //   provide: APP_GUARD,
    //   useClass: ClassRolesGuard,
    // },
    {
      // 라우트 핸들러와 클래스 모두 가드 적용
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
