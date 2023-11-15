import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './interface/users.controller';
import { EmailModule } from 'src/email/email.module';
import { UserEntity } from './infra/db/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserHandler } from './application/command/create-user.handler';
import { VerifyEmailHandler } from './application/command/verify-email.handler';
import { UserLoginHandler } from './application/command/user-login.handler';
import { UserEventsHandler } from './application/event/user-events.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.query.handler';
import { UserRepository } from './infra/db/repository/user.repository';
import { EmailService } from './infra/adaptor/email.service';
import { UserFactory } from './domain/user.factory';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    Logger,
    CreateUserHandler,
    VerifyEmailHandler,
    UserLoginHandler,
    UserEventsHandler,
    GetUserInfoQueryHandler,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'EmailService',
      useClass: EmailService,
    },
    UserFactory,
  ],
})
export class UsersModule {}
