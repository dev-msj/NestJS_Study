import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserData = createParamDecorator(
  // data: string -> 데코레이터 파라메터는 string만 받을 수 있게 제한
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // AuthGuard에서 생성한 user 객체를 반환.
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
