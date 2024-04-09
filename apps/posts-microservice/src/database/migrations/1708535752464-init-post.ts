import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitPost1708535752464 implements MigrationInterface {
  name = 'InitPost1708535752464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_c9ea9fb61d2df61a0e86cab1671" UNIQUE ("title"), CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post_entity"`);
  }
}
