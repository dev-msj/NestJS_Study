import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv');

export class OrmConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  isDevelopment() {
    return this.getValue('NODE_ENV', false) === 'development';
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DB_HOST'),
      port: Number(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: this.getValue('DB_SYNCHRONIZE') === 'true',
    }
  }
}
