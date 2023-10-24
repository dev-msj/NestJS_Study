import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';

/**
 * 클래스를 생성할 때는 다음과 같은 네이밍 컨벤션을 가진다.
 *
 * class name : pascal case
 * 파일명 : {class name의 단어를 소문자로 작성하고 '-'로 구분}.{Resource Type}.ts
 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Header 데코레이터를 통해 커스텀 헤더를 설정할 수 있다.
  @Header('Custom', 'Add Custom Header')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // wild card를 Get 데코레이터에 사용하면, 그 자리에 어떤 문자가 와도 라우팅을 한다.
  // 하지만 '-'과 '.'은 허용되지 않는다.
  @Get('/*ello')
  getHelloWithWildCard(): string {
    return this.appService.getHello() + ' with wild card';
  }

  // Req 데코레이터를 사용해 request 객체를 직접 받을 수 있다.
  @Get('/request')
  getHelloWithRequest(@Req() req: Request): Request {
    return req;
  }

  @Get('/throwException')
  throwError() {
    // 잘못된 요청에 대한 예외 처리
    throw new BadRequestException('잘못된 요청입니다.');
  }

  // Redirect 데코레이터를 통해 다른 페이지로 이동시킬 수 있다. 두번째 인수는 상태 코드다.
  @Redirect('https://www.naver.com', 301)
  @Get('/redirect')
  redirect() {}

  // Param 데코레이터를 통해 라우트 매개변수를 받을 수 있다.
  @Get('/routeParameter/single/:param')
  singleRouteParameter(@Param('param') param: string) {
    return param;
  }

  // 여러 개의 라우트 매개변수를 직접 받는 법
  @Get('/routeParameter/multi1/:param1/:param2')
  multipleRouteParameter1(
    @Param('param1') param1: string,
    @Param('param2') param2: string,
  ) {
    return [param1, param2];
  }

  // 여러 개의 라우트 매개변수를 객체로 묶어서 받는 법
  @Get('/routeParameter/multi2/:param1/:param2')
  multipleRouteParameter2(@Param() params: { [key: string]: string }) {
    return [params.param1, params.param2];
  }
}
