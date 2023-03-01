import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1659623174460 implements MigrationInterface {
  name = 'updateTable1659623174460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "warmup_day_schedule_audience" ALTER COLUMN "status" SET DEFAULT 'todo'`,
    );
    await queryRunner.query(
      `UPDATE "warmup_day_schedule_audience" SET "status" = 'todo' WHERE "status" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "warmup_day_schedule_audience" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
