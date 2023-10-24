import { Inject, Injectable } from '@nestjs/common';
import { SampleAService } from './sample-A.service';

// Injectable 데코레이터을 통해 의존성 주입(DI)이 가능하도록 만든다.
@Injectable()
export class BaseService {
  /**
   * 생성자 대신 Inject 데코레이터를 통해 속성 기반 주입을 할 수 있다.
   * 커스텀 Provider를 활용하면 string, Symbol Type도 DI할 수 있다.
   */
  @Inject(SampleAService) private readonly sampleAService: SampleAService;
  // constructor(private readonly sampleAService: SampleAService) {}

  getHello(): string {
    return 'Hello World Base!';
  }

  // DI된 sampleAService의 method를 수행한다.
  doFuncFromSampleAService(): string {
    return this.sampleAService.getHello();
  }
}
