import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

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
    // nest의 모든 exception은 HttpException을 상속 받는다.
    // throw new HttpException(
    //   { errorMessage: '잘못된 요청입니다.', foo: 'bar' },
    //   HttpStatus.BAD_REQUEST,
    // );

    // 2번째 인수를 통해 description을 수정할 수 있다.
    throw new BadRequestException(
      '잘못된 요청입니다.',
      'custom bad request exception',
    );
  }

  @Get('/db-host-from-config')
  getDBHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
