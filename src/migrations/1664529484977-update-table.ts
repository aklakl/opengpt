import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1664529484977 implements MigrationInterface {
  name = 'updateTable1664529484977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "company_name" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "company_name"`,
    );
  }
}
