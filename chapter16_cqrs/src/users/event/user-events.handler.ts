import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';
import { EmailService } from 'src/email/email.service';
import { TestEvent } from './test.event';

@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler
  implements IEventHandler<UserCreatedEvent | TestEvent>
{
  constructor(private readonly emailService: EmailService) {}

  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent...');

        if (event.name === UserCreatedEvent.name) {
          const { email, signupVerifyToken } = event as UserCreatedEvent;
          await this.emailService.sendMemberJoinVerification(
            email,
            signupVerifyToken,
          );
        }

        break;
      }
      case TestEvent.name: {
        console.log('TestEvent...');
        break;
      }
      default:
        break;
    }
  }
}
