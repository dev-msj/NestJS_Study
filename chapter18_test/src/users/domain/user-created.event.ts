import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs.event.abstract';

// User 도메인과 밀접한 관계를 가지므로 domain 경로에 위치시킨다.
export class UserCreatedEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly signupVerifyToken: string,
  ) {
    super(UserCreatedEvent.name);
  }
}
