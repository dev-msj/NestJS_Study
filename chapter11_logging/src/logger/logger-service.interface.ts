import { LogLevel } from '@nestjs/common';

export interface LoggerService {
  log(message: any, ...optionalParams: any[]): any;
  error(message: any, ...optionalParams: any[]): any;
  warn(message: any, ...optionalParams: any[]): any;
  debug?(message: any, ...optionalParams: any[]): any;
  berbose?(message: any, ...optionalParams: any[]): any;
  setLogLevels?(level: LogLevel[]);
}
