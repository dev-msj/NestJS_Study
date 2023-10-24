import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { ApiVersionController } from './api/api-version.controller';

/**
 * sub domain을 추가할 때는 가장 최상위 controller가 가장 나중 위치에 있어야 한다.
 * 그렇지 않다면 동일한 경로를 가질 경우 무조건 최상위 controller만 인식하게 되는 것 같다.
 * 예상하기로는 ApiVersionController, ApiController는 서브(하위) 도메인이라서,
 * 같은 경로라면 controllers list를 iterate 할 때 최상위 도메인인
 * AppController가 먼저 매칭되어 결과를 반환해버리기 때문인 것 같다.
 */
@Module({
  imports: [UsersModule],
  controllers: [ApiVersionController, ApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
