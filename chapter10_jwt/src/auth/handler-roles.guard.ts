import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class HandlerRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // request.user의 jwt를 통해 얻어낸 정보라고 가정
    const uid = 'user-id';

    // jwt를 통해 db에서 가져온 user의 role이 admin이라고 가정
    const userRole = this.getUserRole(uid);

    // 다음 실행될 라우트 핸들러에 정의된 roles를 가져옴.
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // 다음 실행될 라우트 핸들러에 정의된 roles와 db에 정의된 role 비교
    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(uid: string) {
    return 'admin';
  }

}