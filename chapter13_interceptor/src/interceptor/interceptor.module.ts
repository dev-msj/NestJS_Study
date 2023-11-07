import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  providers: [
    Logger,
    // DI 하기 위해 LoggingInterceptor를 Module로 분리
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class InterceptorModule {}
