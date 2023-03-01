import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1662631449293 implements MigrationInterface {
  name = 'updateTable1662631449293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_configuration_item" ("id" SERIAL NOT NULL, "partner_id" character varying NOT NULL, "parent_item" character varying, "item" character varying NOT NULL, "value" json NOT NULL, "is_default" boolean, CONSTRAINT "PK_5594cf69d743cc7343e4c1f4204" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" ADD "introduction" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_configuration_logo" DROP COLUMN "introduction"`,
    );
    await queryRunner.query(`DROP TABLE "partner_configuration_item"`);
  }
}
