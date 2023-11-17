import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserLoginCommand } from './user-login.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infra/db/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async execute(command: UserLoginCommand): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: command.email, password: command.password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login(user.toUserInfo());
  }
}
