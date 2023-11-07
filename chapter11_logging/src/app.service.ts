import { Injectable, Logger } from '@nestjs/common';
import { MyLogger } from './logger/my-logger.service';

@Injectable()
export class AppService {
  // 내장 로거를 활용
  private readonly logger = new Logger(AppService.name);

  // 커스텀 로거를 활용
  constructor(private readonly myLogger: MyLogger) {}

  getHello(): string {
    this.logger.error('level: error');
    this.logger.warn('level: warn');
    this.logger.log('level: log');
    this.logger.verbose('level: verbose');
    this.logger.debug('level: debug');

    this.myLogger.error('level: error');
    this.myLogger.warn('level: warn');
    this.myLogger.log('level: log');
    this.myLogger.verbose('level: verbose');
    this.myLogger.debug('level: debug');

    return 'Hello World';
  }
}
