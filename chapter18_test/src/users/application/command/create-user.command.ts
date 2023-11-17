import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '../../interface/dto/create-user.dto';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static from(createUserDto: CreateUserDto): CreateUserCommand {
    return new CreateUserCommand(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
  }
}
