import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: Number(configService.get('DB_PORT')),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      // TypeORM이 자동으로 인식할 entity class 경로
      entities: ['dist/**/*.entity{.ts,.js}'],
      // 서비스 구동 시 소스 코드 기반으로 DB Schema 동기화 여부
      // true면 서비스가 시작될 때 자동으로 테이블 생성. 미리 만들어 놓으면 Error 남.
      // synchronize: process.env.DB_SYNCHRONIZE === 'true',
      synchronize: configService.get('DB_SYNCHRONIZE') === 'true',

      // 연결 재시도 횟수. default: 10
      // retryAttempts: 10,

      // 재시도 간의 지연 시간(ms). default: 3000
      // retryDelay: 3000,

      // 에러가 났을 때, 인수 err를 받아서 연결을 시도할지 판단하는 함수.
      // toRetry: (err: any) => false,

      // 엔티티를 자동 로드할지 여부
      // autoLoadEntities: false,

      //연결을 재시도할 때 verbose 레벨로 에러 메시지를 출력할지 여부.
      // verbose -> 상세 메시지
      // verboseRetryLog: false,
    };
  },
};
