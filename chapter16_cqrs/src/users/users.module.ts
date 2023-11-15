import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserHandler } from './command/create-user.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { UserLoginHandler } from './command/user-login.handler';
import { UserEventsHandler } from './event/user-events.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info.query.handler';

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
  ],
})
export class UsersModule {}
