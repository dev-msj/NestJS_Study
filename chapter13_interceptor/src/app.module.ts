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
import { LoggerModule } from './logger/logger.module';
import { RolesModule } from './auth/roles.module';
import { ExceptionModule } from './exception/exception.module';
import { InterceptorModule } from './interceptor/interceptor.module';

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
    InterceptorModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
