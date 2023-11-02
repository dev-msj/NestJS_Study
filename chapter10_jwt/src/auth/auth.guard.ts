import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Request } from 'express';

/**
 * Guard를 적용하는 방법
 *
 * 1. Controller에 직접 useGuard 데코레이터를 선언.
 *    여러 개의 guard를 적용하고 싶다면 콤마로 구분하여 작성.
 * 2. main.ts에서 전역 선언.
 * 3. guard에 종속성 주입을 사용하기 위해 module에서 custom provider 선언.
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ExecutionContext는 ArgumentsHost를 상속받아 요청과 응답에 대한 정보를 가진다.
    const request = context.switchToHttp().getRequest();

    const user = this.validateRequest(request);

    // token의 payload를 통해 알아낸 정보를 request에 담는다.
    request.user = {
      name: user.userId,
      email: user.email,
    };

    return true;
  }

  /**
   * false를 반환하면 403(Forbidden)을 던진다.
   * 만약 다른 에러를 응답하고 싶다면 직접 던져줘야한다.
   */
  private validateRequest(request: Request) {
    // token이 유효하지 않으면 401(Unauthorized)를 던진다.
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    return this.authService.verify(jwtString);
  }
}
