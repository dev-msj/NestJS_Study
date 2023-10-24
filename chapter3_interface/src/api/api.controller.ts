import { Controller, Get } from '@nestjs/common';

// host를 지정하여 서브 도메인으로 라우팅 할 수 있다.
// localhost로 서브 도메인을 사용하려면 '/etc/hosts'에 해당 주소를 추가해야 한다.
@Controller({ host: 'api.localhost' })
export class ApiController {
  @Get()
  index(): string {
    return 'Hello, API!';
  }
}
