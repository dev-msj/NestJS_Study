import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = this.validateRequest(request);

    request.user = {
      name: user.userId,
      email: user.email,
    };

    console.log('auth guard')

    return true;
  }

  private validateRequest(request: Request) {
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    return this.authService.verify(jwtString);
  }
}
