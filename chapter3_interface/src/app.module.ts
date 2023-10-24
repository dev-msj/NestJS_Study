import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { ApiVersionController } from './api/api-version.controller';

// sub domain을 추가할 때는 가장 최상위 controller가 가장 나중 위치에 있어야 한다.
// 그렇지 않다면 동일한 경로를 가질 경우 무조건 최상위 controller만 인식하게 되는 것 같다.
@Module({
  imports: [UsersModule],
  controllers: [
    UsersController,
    ApiVersionController,
    ApiController,
    AppController,
  ],
  providers: [AppService, UsersService],
})
export class AppModule {}
