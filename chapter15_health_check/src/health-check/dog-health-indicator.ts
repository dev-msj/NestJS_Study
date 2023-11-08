import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

export interface Dog {
  name: string;
  type: string;
}

// terminus가 제공하지 않는 상태 표기기가 필요하면 HealthIndicator 상속받아 구현한다.
export class DogHealthIndecator extends HealthIndicator {
  private dogs: Dog[] = [
    { name: 'Fido', type: 'goodboy' },
    { name: 'Rex', type: 'badboy' },
  ];

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const badboys = this.dogs.filter((dog) => dog.type === 'badboy'); // [{ name: 'Rex', type: 'badboy' }]
    const isHealthy = badboys.length === 0; // false
    const result = this.getStatus(key, isHealthy, { badboys: badboys.length });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Dogcheck failed', result);
  }
}
