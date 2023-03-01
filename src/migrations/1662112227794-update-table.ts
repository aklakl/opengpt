import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1662112227794 implements MigrationInterface {
  name = 'updateTable1662112227794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "replay_to_addresses" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "replay_to_addresses"`,
    );
  }
}
