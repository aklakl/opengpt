import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1666886755197 implements MigrationInterface {
  name = 'updateTable1666886755197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "warmup_config" ADD "external_config" json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "warmup_config" DROP COLUMN "external_config"`,
    );
  }
}
