import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1660568060777 implements MigrationInterface {
  name = 'updateTable1660568060777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "warmup_config" 
          ("created_by" character varying, "updated_by" character varying, 
            "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, 
            "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, 
            "id" SERIAL NOT NULL, "initial_count" integer, "initial_step" integer, 
            "warning_bounce_rate" numeric(5,2) NOT NULL, "warning_receivers" text array, 
            CONSTRAINT "PK_017aa0f83c55e47b0f7f88a889d" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "warmup_config"`);
  }
}
