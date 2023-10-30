import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Middleware의 용도
 *
 * - 쿠키 파싱
 * - 세션 관리
 * - 인증/인가
 * - 본문 파싱: json이나 file stream과 같은 데이터를 읽고 해석한 다음 매개변수에 넣음.
 */

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    console.log('Request...');

    // 다음 middleware(Logger2Middleware)를 호출한다.
    next();
  }
}
