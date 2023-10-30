import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class Logger2Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    console.log('Request2...');

    // 다음 middleware나 라우트 핸들러로 가지 않고 바로 응답한다.
    res.send('Done...');
  }
}
