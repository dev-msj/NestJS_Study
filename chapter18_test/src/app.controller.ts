import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ExceptionInterceptor } from './interceptor/exception.interceptor';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/error')
  error(): string {
    throw new BadRequestException(
      '잘못된 요청입니다.',
      'custom bad request exception',
    );
  }

  @UseInterceptors(ExceptionInterceptor)
  @Get('/interceptor/exception')
  interceptorException(): string {
    throw new InternalServerErrorException('인터셉터 exception 핸들링');
  }

  @Get('/db-host-from-config')
  getDBHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
