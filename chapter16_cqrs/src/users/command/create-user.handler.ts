import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ulid } from 'ulid';
import { UserCreatedEvent } from '../event/user-created.event';
import { TestEvent } from '../event/test.event';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    await this.checkUserExists(command.email);

    const signupVerifyToken = uuid.v1();

    await this.save(command, signupVerifyToken);

    /**
     * 만약 email 발송 관련 로직이 변경이 있을 경우,
     * 회원 가입 로직을 다시 수정해야 한다.
     * 이 것은 email 발송과 회원 가입 로직이 강하게
     * 결합되어 있다는 것을 의미한다.
     * 하지만 이 2가지는 별개로 다룰 수 있는 내용이다.
     * 그러므로 이벤트 구독하는 다른 모듈에서 email 발송을
     * 비동기로 처리하도록 하여 결합도를 낮출 수 있다.
     */
    this.eventBus.publish(
      new UserCreatedEvent(command.email, signupVerifyToken),
    );
    this.eventBus.publish(new TestEvent());
  }

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user !== undefined;
  }

  private async save(
    createUserCommend: CreateUserCommand,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.uid = ulid();
      user.name = createUserCommend.name;
      user.email = createUserCommend.email;
      user.password = createUserCommend.password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
