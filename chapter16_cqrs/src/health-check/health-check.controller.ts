import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DogHealthIndecator } from './dog-health-indicator';

/**
 * Terminus가 제공하는 상태 표시기
 *
 * - HttpHealthIndicator
 * - MoongooseHealthIndicator
 * - TypeOrmHealthIndicator
 * - SequelizeHealthIndicator
 * - MicroserviceHealthIndicator
 * - MemoryHealthIndicator
 * - GRPCHealthIndicator
 * - DiskHealthIndicator
 */

/**
 * Health Check Result
 *
 * - status: HealthCheckStatus. 헬스 체크를 수행한 전반적인 상태('error' | 'ok' | 'shutting_down')
 * - info?: HealthIndicatorResult. 상태가 'up'일 때의 상태 정보
 * - error?: HealthIndicatorResult. 상태가 'down'일 때의 상태 정보
 * - details: HealthIndicatorResult. 모든 상태 표시기의 정보
 */

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly healthCheck: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly dogHealthIndicator: DogHealthIndecator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheck.check([
      // ping check를 통해 다른 서버가 잘 동작하고 있는지 확인
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      // db가 정상적으로 동작하고 있는지 확인
      () => this.db.pingCheck('database'),
      // 커스텀 HealthIndicator
      () => this.dogHealthIndicator.isHealthy('dog'),
    ]);
  }
}
