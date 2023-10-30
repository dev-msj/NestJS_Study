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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // middleware를 어디에 적용할지 관리
    consumer
      // middleware를 적용할 클래스
      .apply(LoggerMiddleware, Logger2Middleware)
      // RouteInfo 객체로 middleware를 적용하지 않을 경로 설정.
      .exclude({ path: '/users', method: RequestMethod.GET })
      // 일반적으로 controller 객체를 넘겨서 사용
      .forRoutes(UsersController);
    // .forRoutes({ path: '/users', method: RequestMethod.POST }); // RouteInfo
    // .forRoutes('/users'); // Path
  }
}
