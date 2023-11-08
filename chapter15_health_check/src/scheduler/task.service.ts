import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

/**
 * second(초, 0-59)
 * minute(분, 0-59)
 * hour(시간, 0-23)
 * day-of-month(일, 1-31)
 * month(월, 0-12, 0과 12는 12월)
 * day-of-week(요일, 0-7, 0과 7은 일요일)
 *
 * | * * * * * * | => 초마다
 * | 45 * * * * * | => 매분 45초에
 * | 0 10 * * * * | => 매시간 10분에
 * | 0 /30 9-17 * * * | => 9시부터 17까지 30분마다
 * | 0 30 11 * * 1-5 | => 월-금요일 11시 30분에
 */

/**
 * Cron Option
 *
 * name: Task의 이름
 * timeZone: 실행 시간대 설정
 * utcOffset: timeZone 대신 UTC 기반으로 시간대의 오프셋을 지정
 * unrefTimeout: Node.js의 timeout.unref()와 관련 있음.
 *               크론잡의 상태에 관계 없이 이벤트 루프에 있는 잡이 완료될 때
 *               노드 프로세스를 중지하고 싶을 때 사용
 *
 * => timeZone과 utcOffset은 함께 사용하면 문제가 발생할 수 있음.
 */

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {
    // TaskService 객체가 생성될 때 SchedulerRegistry에 CronJob을 등록한다.
    this.addCronJob();
  }

  @Cron('* * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('매초마다 수행');
  }

  @Cron(new Date(Date.now() + 3 * 1000))
  handleCronOnce() {
    this.logger.log('앱이 실행되고 3초 뒤에 한번만 수행');
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_10PM)
  handleCronExcpression() {
    this.logger.log('월-금요일 오후 10시에 수행');
  }

  @Interval('intervalTask', 3000)
  handleInterval() {
    this.logger.log('앱이 실행되고 3초 뒤에 수행하며 3초마다 반복');
  }

  @Timeout('timeoutTask', 5000)
  handleTimeout() {
    this.logger.log('앱이 실행되고 5초 뒤에 테스트를 한 번만 수행');
  }

  private addCronJob() {
    const name = 'cronSample';
    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }
}
