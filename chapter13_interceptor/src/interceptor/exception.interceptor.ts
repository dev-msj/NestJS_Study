import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * exception 핸들링은 filter에서 처리하는 것이 좋으나
 * interceptor에서도 가능하다는 것만 확인한다.
 */
@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((err) =>
          throwError(() => new BadGatewayException(err.message)),
        ),
      );
  }
}
