import {
  Logger,
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
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Logger2Middleware } from './middleware/logger2.middleware';
import { UsersController } from './users/users.controller';
import { typeOrmConfig } from './config/typeOrmConfig.service';
import authConfig from './config/authConfig';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { LoggerModule } from './logger/logger.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ExceptionModule } from './exception/exception.module';
import { RolesModule } from './auth/roles.module';

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
    LoggerModule,
    RolesModule,
    ExceptionModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    AppService,
    // {
    //   // 필터에 DI가 필요할 경우 커스텀 프로바이더를 활용
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    // Logger,
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
