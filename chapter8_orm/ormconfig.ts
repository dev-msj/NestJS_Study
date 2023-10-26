import { DataSource } from 'typeorm';

/**
 * Migration 실행 명령어: npm run + 아래의 명령어
 * 
 * - migration:create
 *     -> 수행할 마이그레이션 내용이 비어있는 파일을 생성.
 *     -> npm run typeorm migration:create {migration 파일 생성할 경로}/{생성될 파일명}
 * 
 * - migration:generate
 *     -> 현재 소스코드의 entity.ts 파일과 migrationsTableName 옵션으로 설정된 
 *        migrations 테이블(migrations 이력)을 기반으로 마이그레이션 파일을 자동 생성.
 *     -> npm run typeorm migration:generate {migration 파일 생성할 경로}/{생성될 파일명} -- -d {datasource(ormconfig.ts) 경로}
 * 
 * - migration:run
 *     -> 마이그레이션을 수행.
 *     -> npm run typeorm migration:run -- -d {datasource(ormconfig.ts) 경로}
 * 
 * - migration:revert
 *     -> 적용된 마이그레이션을 되돌림.
 *     -> npm run typeorm migration:revert -- -d {datasource(ormconfig.ts) 경로}
 */

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  synchronize: false,
  // 서버가 구동될 때 마이그레션을 수행하게 할지 설정함.
  migrationsRun: false,
  // 마이그레이션을 수행할 파일이 관리되는 경로
  migrations: [`${__dirname}/**/migrations/*.ts`],
  // 마이그레이션 이력이 기록되는 테이블 이름을 설정. default: migrations
  migrationsTableName: 'migrations',
});
