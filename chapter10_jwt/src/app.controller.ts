import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * controller에 직접 guard룰 적용하는 법.
 * 여러 개의 guard를 적용하고 싶다면 콤마로 구분하여 작성.
 */
// @UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/db-host-from-config')
  getDBHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
