import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1663617549310 implements MigrationInterface {
  name = 'updateTable1663617549310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "replay_to_addresses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "reply_to_addresses" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "enforce_from_or_replyto" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "set_plaintext_footer" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "set_plaintext_footer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "enforce_from_or_replyto"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "reply_to_addresses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "replay_to_addresses" text`,
    );
  }
}
