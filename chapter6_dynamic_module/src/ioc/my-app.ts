import { Inject } from '@nestjs/common';
import { Person } from './person.interface';

export class MyApp {
  /**
   * Person은 interface인데도 DI가 가능한 이유는
   * 어딘가에서 객체를 정의해주기 때문이다.
   * 이 객체는 모듈에서 커스텀 데코레이터를 활용해 정의해주고 있다.
   * 그리고 정의된 객체를 NestJS의 IoC 컨테이너가
   * MyApp class에게 DI 해주고 있다.
   */
  constructor(@Inject('Person') private p: Person) {}
}
