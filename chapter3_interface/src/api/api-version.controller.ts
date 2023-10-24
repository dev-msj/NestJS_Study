import { Controller, Get, HostParam } from '@nestjs/common';

// Host Parameter를 지정하며 버전별로 서브 도메인을 관리할 수 있다.
@Controller({ host: ':version.api.localhost' })
export class ApiVersionController {
  @Get()
  index(@HostParam('version') version: string): string {
    // HostParam 데코레이터를 통해 서브 도메인 변수값을 가져올 수 있다.
    return `Hello, API ${version}`;
  }
}
