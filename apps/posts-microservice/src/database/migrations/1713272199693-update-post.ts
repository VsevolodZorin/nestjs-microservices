import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePost1713272199693 implements MigrationInterface {
    name = 'UpdatePost1713272199693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "postId" integer, "parentCommentId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "comment_postId_index" ON "comments" ("postId") `);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "UQ_6e606c5d905ee68d531a4d66a06" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "paragraphs" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "UQ_c9ea9fb61d2df61a0e86cab1671"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4875672591221a61ace66f2d4f9"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "UQ_c9ea9fb61d2df61a0e86cab1671" UNIQUE ("title")`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "paragraphs"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "UQ_6e606c5d905ee68d531a4d66a06"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."comment_postId_index"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
