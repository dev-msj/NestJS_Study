import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../filter/http-exception.filter';

// AppModule에 있던 필터 커스텀 프로바이더를 모듈로 분리
@Module({
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ExceptionModule {}
