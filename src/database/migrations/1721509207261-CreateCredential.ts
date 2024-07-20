import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCredential1721509207261 implements MigrationInterface {
  name = 'CreateCredential1721509207261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "credentials" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password_digest" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c286aa8e09ecff5cc756ee83214" UNIQUE ("email"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "credentials"`);
  }
}
