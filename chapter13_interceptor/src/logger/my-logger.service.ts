import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: unknown, stack?: unknown, context?: unknown): void {
    super.error.apply(this, arguments);

    this.doSomething();
  }

  private doSomething() {
    console.log('save DB');
  }
}
