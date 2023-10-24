import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SampleBService } from './sample-B.service';
import { SampleAService } from './sample-A.service';
import { EmailService } from './email/email.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  // 신규 추가되는 provider(service, factory, repository, helper 등)을 등록한다.
  providers: [AppService, SampleBService, SampleAService, EmailService],
})
export class AppModule {}
