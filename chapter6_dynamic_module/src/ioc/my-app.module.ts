import { Module } from '@nestjs/common';
import { Dexter } from './dexter';
// import { Jane } from './jane';

/**
 * Person 인터페이스의 실제 구현체에 대한 정의를
 * 클래스 프로바이더를 통해 해주고 있다.
 * 구현체를 바꾸고 싶을 경우, useClass의 객체만 변경해주면 된다.
 */
@Module({
  controllers: [],
  providers: [
    {
      provide: 'Person',
      useClass: Dexter,
      // useClass: Jane,
    },
  ],
})
export class MyAppModule {}
