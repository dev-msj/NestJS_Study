import { MigrationInterface, QueryRunner } from "typeorm"

// npm run typeorm migration:create {path} 명령어를 통해 만들어지는 class
// class 명은 설정한 이름과 파일 생성 시각(Unix 시간)을 합쳐서 만들어짐.
export class CreateUserTable1698344117388 implements MigrationInterface {

  // npm run typeorm migration:run 명령으로 수행할 코드를 작성함.
  public async up(queryRunner: QueryRunner): Promise<void> {
  }

  // npm run typeorm migration:revert 명령으로 마이그레이션을 되돌릴 코드를 작성함.
  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
