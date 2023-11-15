import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

/**
 * CronJob 객체가 제공하는 메서드
 *
 * - stop: 실행이 예약된 작업을 중지
 * - start: 중지된 작업을 실행
 * - setTime(time:CronTime): 현재 작업을 중단하고 새로 설정한 cron time으로 재시작
 * - lastDate: 작업이 마지막으로 수행된 날짜
 * - nextDates(count: number): 예정된 작업의 실행 시작을 count 개수만큼 배열로 반환. 배열의 요소는 monent 객체
 */

@Controller('batch')
export class BatchController {
  constructor(private readonly scheduleRegistry: SchedulerRegistry) {}

  @Post('start-sample')
  start() {
    // SchedulerRegistry에 등록된 CronJob을 가져온다.
    const job: CronJob = this.scheduleRegistry.getCronJob('cronSample');

    // 가져온 CronJob을 시작한다.
    job.start();

    console.log('start!! ', job.lastDate());
  }

  @Post('stop-sample')
  stop() {
    // SchedulerRegistry에 등록된 CronJob을 가져온다.
    const job: CronJob = this.scheduleRegistry.getCronJob('cronSample');

    // 가져온 CronJob을 종료한다.
    job.stop();

    console.log('stop!! ', job.lastDate());
  }
}
