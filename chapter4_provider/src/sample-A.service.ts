import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleAService {
  getHello(): string {
    return 'Hello World A!';
  }
}
