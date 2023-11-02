import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * any는 실제값과 상관없이 프로퍼티를 호출하거나 또는 연산이 가능하다.
 * 이 것은 결국 런타임 상에서 문제가 될 가능성이 높으며,
 * 타입을 검사하고 처리하는 typescript에서는 치명적인 존재다.
 *
 * unknown 또한 모든 값을 허용하지만, 할당된 값이 어떤 타입인지 모르기 때문에
 * 프로퍼티 또는 연산을 제한한다는 점에서 any 타입과는 다르다.
 * 이를 통해 런타입 상에서 문제 되는 코드를 미리 예방할 수 있다.
 */

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // AuthGuard에서 생성한 user 객체를 반환.
    return request.user;
  },
);
