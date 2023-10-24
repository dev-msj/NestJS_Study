import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  // wild card를 Get 데코레이터에 사용하면, 그 자리에 어떤 문자가 와도 라우팅을 한다.
  // 하지만 '-'과 '.'은 허용되지 않는다.
  @Get('/*ello')
  getHelloWithWildCard(): string {
    return this.appService.getHello() + ' with wild card';
  }

  @Get()
  getHelloWithRequest(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }
}
