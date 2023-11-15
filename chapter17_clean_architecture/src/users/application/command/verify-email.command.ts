import { ICommand } from '@nestjs/cqrs';

export class VerifyEmailCommand implements ICommand {
  constructor(readonly signupVerifyToken: string) {}

  static from(signupVerifyToken: string) {
    return new VerifyEmailCommand(signupVerifyToken);
  }
}
