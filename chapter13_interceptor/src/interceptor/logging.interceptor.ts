import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * 인터셉터를 적용하는 방법
 * - 특정 클래스나 메서드: @UseInterceptors() 선언
 * - 전역: main.ts에서 app.useGlobalInterceptors({interceptor})
 */

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 요청을 처리하기 전
    console.log('Before...');

    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`Request to ${method} ${url}`);

    const now = Date.now();

    // next.handle()을 통해 요청이 처리된 후 인터셉터로 돌아온다.
    return next
      .handle()
      .pipe(tap(() => console.log(`After...${Date.now() - now}ms`)))
      .pipe(
        tap((data) =>
          this.logger.log(
            `Response from ${method} ${url} \n response: ${JSON.stringify(
              data,
            )}`,
          ),
        ),
      );
  }
}
