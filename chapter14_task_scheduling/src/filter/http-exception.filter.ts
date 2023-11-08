import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

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
