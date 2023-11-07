import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 처리되지 않은 모든 예외를 잡음.
export class HttpExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    /**
     * nest의 exception은 기본적으로 HttpException을 상속받는다.
     * 그래서 HttpException이 아닌 exception은 알 수 없는 에러이므로
     * InternalServerErrorException로 처리한다.
     */
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    const stack = exception.stack;

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };

    console.log(log);

    this.logger.debug(`DI된 로거 사용 - ${JSON.stringify(log)}`);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
