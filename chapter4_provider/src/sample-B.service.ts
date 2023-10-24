import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
// import { SampleAService } from './sample-A.service';

@Injectable()
export class SampleBService extends BaseService {
  /**
   * 기본적으로 자식 class에서 부모 class에 필요한 DI를 전달해줘야 한다.
   * 하지만 매번 super를 통해 부모 class에 DI를 하는 것은 번거롭다.
   * 그래서 Inject 데코레이터를 활용해 부모 class에서
   * 필요한 provider를 DI 받을 수 있는 속성 기반 주입을 할 수 있다.
   */
  // constructor(private readonly _sampleAService: SampleAService) {
  //   super(_sampleAService);
  // }

  getHello(): string {
    /**
     * BaseService가 SampleAService를 DI 받았고,
     * 이 서비스 안에서 SampleAService의 method를 수행하는 method를 구현하고 있다.
     * 그리고 SampleBService는 BaseService를 상속받았다.
     * 그래서 SampleBService가 SampleAService를 직접 DI 받지 않아도
     * 부모 class인 BaseService를 통해 SampleBService의 method를 수행할 수 있다.
     */
    return this.doFuncFromSampleAService();
  }
}
