import { ICommand } from '@nestjs/cqrs';
import { UserLoginDto } from '../dto/user-login.dto';

export class UserLoginCommand implements ICommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}

  static from(userLoginDto: UserLoginDto) {
    return new UserLoginCommand(userLoginDto.email, userLoginDto.password);
  }
}
