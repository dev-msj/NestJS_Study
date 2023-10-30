import { NextFunction, Request, Response } from 'express';

/**
 * mains.ts에서 호출하여 express middleware로 설정할 수 있도록 function으로 작성.
 * express middleware는 app.use()로 선언하는데,
 * 이 메서드는 class를 인수로 받을 수 없기 때문에 function으로 middle를 작성한다. 
 */
export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log('Request3...');

  next();
}
