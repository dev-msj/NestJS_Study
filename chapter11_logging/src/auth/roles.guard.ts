import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const uid = 'user-id';

    const userRole = this.getUserRole(uid);

    const roles: string[] = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Role이 지정되지 않으면 pass 시키기 위한 조건문.
    if (roles.length === 0) {
      return true;
    }

    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(uid: string) {
    return 'admin';
  }
}
