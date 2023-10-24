import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  @Inject(ConfigService) private readonly configService: ConfigService;

  @Get('/db-host-from-config')
  getDBHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
