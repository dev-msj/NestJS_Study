import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../domain/user-created.event';
import { Inject } from '@nestjs/common';
import { IEmailService } from '../adaptor/iemail.service';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject('EmailService')
    private readonly emailService: IEmailService,
  ) {}

  async handle(event: UserCreatedEvent) {
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
      default:
        break;
    }
  }
}
