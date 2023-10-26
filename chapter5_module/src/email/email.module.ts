import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

// @Global // 모듈을 전역으로 사용하고 싶을 경우에 사용한다.
@Module({
  // EmailModule에서 EmailService를 사용할 수 있도록 제공한다.
  providers: [EmailService],

  // UsersService가 속한 UsersModule에서도 사용할 수 있어야 하므로 내보내기를 한다.
  exports: [EmailService],
})
export class EmailModule {}
