import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from './user';
import { UserCreatedEvent } from './user-created.event';
import { UserEntity } from '../infra/db/entities/user.entity';

/**
 * User 도메인 객체의 상태 변화에 따라 발생되는 이벤트를 처리한다.
 */

@Injectable()
export class UserFactory {
  constructor(private readonly eventBus: EventBus) {}

  create(
    uid: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): User {
    const user = new User(uid, name, email, password, signupVerifyToken);

    // CreateUserHandler 대신 UserFactory가 UserCreatedEvent를 발행한다.
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));

    return user;
  }

  // UserEntity를 User로 변환한다.
  reconstitute(userEntity: UserEntity): User {
    return new User(
      userEntity.uid,
      userEntity.name,
      userEntity.email,
      userEntity.password,
      userEntity.signupVerifyToken,
    );
  }
}
