import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { ApiVersionController } from './api/api-version.controller';

/**
 * sub domain을 추가할 때는 루트 controllers의 controller가 가장 마지막에 있어야 한다.
 * 서브(하위) 도메인은 root controller와 같은 엔드 포인트를 가진다.
 * 그래서 root controller가 앞에 있을 경우, controllers list를 iterate하면서
 * 엔드 포인트가 먼저 매칭되는 root controller를 반환해버리기 때문이다.
 */
@Module({
  imports: [UsersModule],
  // 신규 추가되는 controller를 list에 추가하여 등록한다.
  controllers: [ApiVersionController, ApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
