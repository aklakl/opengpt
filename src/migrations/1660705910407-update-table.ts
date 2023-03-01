import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1660705910407 implements MigrationInterface {
  name = 'updateTable1660705910407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "custom_footer" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "opengpt_campaign_instance_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ALTER "logo" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ALTER "icon" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ALTER "color_primary" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ALTER "color_secondary" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "opengpt_campaign_instance_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "custom_footer"`,
    );
  }
}
