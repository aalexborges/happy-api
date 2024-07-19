import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLog1721415923013 implements MigrationInterface {
  name = 'CreateAuditLog1721415923013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" BIGSERIAL NOT NULL, "item_type" character varying NOT NULL, "item_id" bigint NOT NULL, "event" character varying(15) NOT NULL, "whodunnit" character varying, "object" json, "object_changes" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_198ba7de3078a959bbe09cab43" ON "audit_logs" ("item_type", "item_id") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_198ba7de3078a959bbe09cab43"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
  }
}
