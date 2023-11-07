import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class Logger2Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    console.log('Request2...');

    // res.send('Done...');
    next();
  }
}
