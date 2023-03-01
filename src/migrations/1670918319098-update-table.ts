import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1670918319098 implements MigrationInterface {
  name = 'updateTable1670918319098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" ADD "schedule_id" character varying NOT NULL DEFAULT 'unknown'`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" ADD "audience_size" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" ADD "status" character varying NOT NULL DEFAULT 'done'`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" ADD "error_message" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" ALTER COLUMN "remark" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd98c2026d5e8770de0a87dd36" ON "schedule_trigger_log" ("opengpt_campaign_instance_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2fdd8dc7dd0668a484895550c5" ON "schedule_trigger_log" ("schedule_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2fdd8dc7dd0668a484895550c5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd98c2026d5e8770de0a87dd36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" ALTER COLUMN "remark" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" DROP COLUMN "error_message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" DROP COLUMN "audience_size"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_trigger_log" DROP COLUMN "schedule_id"`,
    );
  }
}
