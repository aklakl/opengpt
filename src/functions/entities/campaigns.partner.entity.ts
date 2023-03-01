import {
  Column,
  CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import {
  Authorship, CampaignStatus, NotificationAction, SendToTheseUsers
} from '../constant/enums';
import { CampaignAudience } from './campaign.audience.entity';
@Entity()
export class CampaignsPartner {
  @PrimaryGeneratedColumn('uuid', { name: 'opengpt_campaign_instance_id' })
  public opengptCampaignInstanceId: string;

  @Column({ name: 'partner_id' })
  public partnerId: string;

  @Column({ name: 'opengpt_campaign_id' })
  public opengptCampaignId: string;

  // @Column({ name: "opengpt_campaign_type" })
  // public opengptCampaignType: string;

  @Column({ nullable: true, name: 'notification_title' })
  public notificationTitle: string;

  @Column({ nullable: true, name: 'notification_messageBody' })
  public notificationMessageBody: string;

  @Column({
    nullable: true,
    name: 'notification_action',
    default: NotificationAction.OPENAPP,
  })
  public notificationAction: string;

  @Column({ nullable: true, name: 'notification_redirectURL' })
  public notificationRedirectURL: string;

  @Column({ nullable: true, name: 'delivery' })
  public delivery: string;

  @Column({ nullable: true, name: 'immediately', default: false })
  public immediately: boolean;

  @Column({ nullable: true, name: 'http_params' })
  public httpParams: string;

  @Column({ nullable: true, name: 'global_filter' })
  public globalFilter: string;

  @Column({ nullable: true, name: 'email_from' })
  public emailFrom: string;

  @Column({ name: 'introduction', nullable: true })
  public introduction: string;

  @Column({ name: 'email_subject_overwrite', nullable: true })
  public emailSubjectOverwrite: string;

  @Column({ name: 'email_preheader_overwrite', nullable: true })
  public emailPreheaderOverwrite: string;

  //This is create by Braze API, the campaign_send_id like <partner_Id>_<opengpt_campaign_id>
  @Column({ name: 'campaign_send_id', nullable: true })
  public campaignSendId: string;

  @Column('text', { array: true, default: [] })
  public tags: string[];

  @Column({ name: 'dag_id', nullable: true })
  public dagId: string;

  @Column({ name: 'dag_status', nullable: true })
  public dagStatus: string;

  @Column({ name: 'warmup', nullable: true, default: false })
  public warmup: boolean;

  @Column({ name: 'warmup_schedule_id', nullable: true })
  public warmupScheduleId: string;

  @Column({ name: 'audience_size', nullable: true })
  public audienceSize: number;

  @Column({ name: 'audience_summary', nullable: true })
  public audienceSummary: string;

  @Column({
    name: 'send_to_these_users',
    nullable: true,
    default: SendToTheseUsers.ALL,
  })
  public sendToTheseUsers?: string;
  // @Column("enum", {
  //   enum: CampaignStatus,
  //   default: CampaignStatus.PASSIVE.toString(),
  // })
  // @Column({
  //   type: "enum",
  //   enum: ["ACTIVE", "PASSIVE"],
  //   default: "PASSIVE"
  // })
  // Draft, Active, Inactive(Paused), Completed. refer：https://docs.google.com/document/u/1/d/1BZTpyLGzJvrlzhF9EziFydV5yWcTLM0n8xnTcW8UCoE/edit?usp=sharing_eip_m&ts=6283cf60
  @Column({ default: CampaignStatus.DRAFT })
  public status: string;

  @Column({ default: Authorship.opengpt })
  public authorship: string;

  @Column({ name: 'created_by', nullable: true })
  public createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  public updatedBy: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @OneToMany(
    type => CampaignAudience,
    campaignAudience => campaignAudience.opengptCampaignInstanceId,
  )
  campaignAudiences: CampaignAudience[];
}
