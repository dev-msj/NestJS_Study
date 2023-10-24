import { Controller, Get } from '@nestjs/common';
import { SampleBService } from './sample-B.service';

@Controller()
export class AppController {
  // 생성자를 통한 의존성 주입(DI)
  constructor(private readonly sampleBService: SampleBService) {}

  // DI된 sampleBService의 method를 수행하고 결과를 반환한다.
  @Get('/sample')
  getSampleAServiceMethodResult(): string {
    return this.sampleBService.doFuncFromSampleAService();
  }
}
