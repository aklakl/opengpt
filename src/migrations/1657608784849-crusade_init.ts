import { MigrationInterface, QueryRunner } from 'typeorm';

export default class crusadeInit1657608784849 implements MigrationInterface {
  name = 'crusadeInit1657608784849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "braze_custom_attribute" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "attribute_name" character varying NOT NULL, "attribute_value" character varying NOT NULL, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "braze_customer_id" integer, CONSTRAINT "PK_6326ae5a0c73ba861795403caa5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "braze_customer" ("id" SERIAL NOT NULL, "external_id" character varying NOT NULL, "partner_id" character varying NOT NULL, "customer_id" character varying NOT NULL, "location_id" character varying NOT NULL, "email_domain" character varying NOT NULL, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_b786fac5a13928a73836a112a5c" UNIQUE ("external_id"), CONSTRAINT "PK_baaf4f8b6402cb8f6e415ad4ff9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign_execution" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" character varying NOT NULL, "opengpt_campaign_instance_id" character varying NOT NULL, "execution_start_time" TIMESTAMP NOT NULL, "executionEndTime" TIMESTAMP NOT NULL, "succesfully_sent_location_ids" text array DEFAULT '{}', "failed_to_send_locaiton_ids" text array DEFAULT '{}', "messages_successfully_sent" integer, "messages_failed_to_send" integer, "remark" text, "dispatchId" character varying, "sendId" text, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_3ba9948bf4fcc6e11c863b4d802" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns_partner" ("opengpt_campaign_instance_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" character varying NOT NULL, "opengpt_campaign_id" character varying NOT NULL, "notification_title" character varying, "notification_messageBody" character varying, "notification_action" character varying DEFAULT 'openApp', "notification_redirectURL" character varying, "delivery" character varying, "immediately" boolean DEFAULT false, "http_params" character varying, "global_filter" character varying, "email_from" character varying, "introduction" character varying, "email_subject_overwrite" character varying, "email_preheader_overwrite" character varying, "campaign_send_id" character varying, "tags" text array NOT NULL DEFAULT '{}', "dag_id" character varying, "dag_status" character varying, "warmup" boolean DEFAULT false, "warmup_schedule_id" character varying, "audience_size" integer, "audience_summary" character varying, "send_to_these_users" character varying DEFAULT 'All users including unsubscribed users', "status" character varying NOT NULL DEFAULT 'Draft', "authorship" character varying NOT NULL DEFAULT 'opengpt', "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_6dcef1e8a48cb9937d037998a4f" PRIMARY KEY ("opengpt_campaign_instance_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign_audience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "opengpt_campaign_instance_id" character varying NOT NULL, "segment_name" character varying, "segment_id" character varying, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "campaigns_partner_opengpt_campaign_instance_id" uuid, CONSTRAINT "PK_3ea2e15fe0b856fcc98674954dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "partner_configuration_logo" ("id" SERIAL NOT NULL, "partner_id" character varying NOT NULL, "logo" text NOT NULL, "icon" text NOT NULL, "color_primary" character varying NOT NULL, "color_secondary" character varying NOT NULL, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_81d87586ad67a4f6b70487cfd77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4c0fa961e06277ed39a045ee93" ON "partner_configuration_logo" ("partner_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "partner_configurations" ("id" SERIAL NOT NULL, "partner_id" character varying NOT NULL, "from_display_name" character varying NOT NULL, "local_part" character varying NOT NULL, "is_default" boolean NOT NULL, "email_domain" character varying NOT NULL, "email_ip_pool" character varying NOT NULL, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_3f25e6b8d8b0c711c2d212b7b14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule_trigger_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" character varying NOT NULL, "campaign_type" character varying DEFAULT 'email', "opengpt_campaign_instance_id" character varying NOT NULL, "remark" text NOT NULL, "dispatch_id" text, "audience" text array DEFAULT '{}', "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_1a89e8ffa5d800e0241d2efe46c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns" ("opengpt_campaign_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "opengpt_journey_id" character varying, "opengpt_campaign_name" character varying NOT NULL, "opengpt_campaign_description" character varying, "channel" character varying NOT NULL DEFAULT 'email', "braze_template_id" character varying, "braze_campaign_id" character varying, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "journey_opengpt_journey_id" uuid, CONSTRAINT "PK_c239e7ef0f7819b932e782917b1" PRIMARY KEY ("opengpt_campaign_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "journeys" ("opengpt_journey_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partner_id" character varying, "opengpt_journey_name" character varying NOT NULL, "journey_description" character varying, "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_194340943d7dd638643ad658392" PRIMARY KEY ("opengpt_journey_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "braze_custom_attribute" ADD CONSTRAINT "FK_9493f1c9b9c920c2c136e45b4c4" FOREIGN KEY ("braze_customer_id") REFERENCES "braze_customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_audience" ADD CONSTRAINT "FK_b2d4420382049e6749d3a7b931c" FOREIGN KEY ("campaigns_partner_opengpt_campaign_instance_id") REFERENCES "campaigns_partner"("opengpt_campaign_instance_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_7772da6ad12724903fcef9f0441" FOREIGN KEY ("journey_opengpt_journey_id") REFERENCES "journeys"("opengpt_journey_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "warmup_day_schedule" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "id" SERIAL NOT NULL, "partner_id" character varying(32), "opengpt_campaign_instance_id" character varying(64) NOT NULL, "schedule_id" character varying(32) NOT NULL, "day" character varying(16) NOT NULL, "status" character varying NOT NULL DEFAULT 'todo', CONSTRAINT "PK_b3b48e2f409aefc587f64357b45" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "warmup_day_schedule_audience" ("id" SERIAL NOT NULL, "token" character varying(64) NOT NULL, "status" character varying, "day_schedule_id" integer, CONSTRAINT "PK_64fe3d5a0c928095dbb2ffa5cfb" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "warmup_day_schedule_audience" ADD CONSTRAINT "FK_aa697cfacf028bbad304c06d6ee" FOREIGN KEY ("day_schedule_id") REFERENCES "warmup_day_schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP CONSTRAINT "FK_7772da6ad12724903fcef9f0441"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_audience" DROP CONSTRAINT "FK_b2d4420382049e6749d3a7b931c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "braze_custom_attribute" DROP CONSTRAINT "FK_9493f1c9b9c920c2c136e45b4c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "warmup_day_schedule_audience" DROP CONSTRAINT "FK_aa697cfacf028bbad304c06d6ee"`,
    );
    await queryRunner.query(`DROP TABLE "journeys"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TABLE "schedule_trigger_log"`);
    await queryRunner.query(`DROP TABLE "partner_configurations"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c0fa961e06277ed39a045ee93"`,
    );
    await queryRunner.query(`DROP TABLE "partner_configuration_logo"`);
    await queryRunner.query(`DROP TABLE "campaign_audience"`);
    await queryRunner.query(`DROP TABLE "campaigns_partner"`);
    await queryRunner.query(`DROP TABLE "campaign_execution"`);
    await queryRunner.query(`DROP TABLE "braze_customer"`);
    await queryRunner.query(`DROP TABLE "braze_custom_attribute"`);
    await queryRunner.query(`DROP TABLE "warmup_day_schedule_audience"`);
    await queryRunner.query(`DROP TABLE "warmup_day_schedule"`);
  }
}
