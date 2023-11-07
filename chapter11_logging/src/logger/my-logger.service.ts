import { ConsoleLogger } from "@nestjs/common";
import { LoggerService } from "./logger-service.interface";

// LoggerService를 직접 구현한 커스텀 로거는 밋밋하게 텍스트만 출력한다.
// export class MyLogger implements LoggerService {
//   log(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   error(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   warn(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   debug?(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   berbose?(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
// }

// 커스텀 로거를 작성하려면 위처럼 직접 다 만드는 것보단 ConsoleLogger를 상속받는 것이 더 좋다.
export class MyLogger extends ConsoleLogger {
  // error 로그를 출력하면 부가적으로 처리할 로직을 작성한다.
  error(message: unknown, stack?: unknown, context?: unknown): void {
    super.error.apply(this, arguments);

    this.doSomething();
  }

  private doSomething() {
    // 로깅과 관련된 부가 로직 작성
    // ex. DB에 저장
    console.log('save DB');
  }
}
