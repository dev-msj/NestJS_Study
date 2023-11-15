import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { UserFactory } from 'src/users/domain/user.factory';
import { IUserRepository } from 'src/users/domain/repository/iuser.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userFactory: UserFactory,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { name, email, password } = command;
    const user = await this.userRepository.findByEmail(email);

    if (user !== null) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const uid = ulid();
    const signupVerifyToken = uuid.v1();

    await this.userRepository.save(
      uid,
      name,
      email,
      password,
      signupVerifyToken,
    );

    this.userFactory.create(uid, name, email, password, signupVerifyToken);
  }
}
