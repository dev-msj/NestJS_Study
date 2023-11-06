import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { HandlerRolesGuard } from 'src/auth/handler-roles.guard';
import { ClassRolesGuard } from 'src/auth/class-roles.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [EmailModule, AuthModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: APP_GUARD,
    //   useClass: HandlerRolesGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ClassRolesGuard,
    // },
    {
      // 라우트 핸들러와 클래스 모두 가드 적용
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class UsersModule {}
