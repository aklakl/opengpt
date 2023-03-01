import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1659509937092 implements MigrationInterface {
  name = 'updateTable1659509937092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "warmup_day_schedule" ADD "audience_size" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "warmup_day_schedule" DROP COLUMN "audience_size"`,
    );
  }
}
