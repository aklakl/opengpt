import {
  Column,
  CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { ChannelType, OneStepStatus } from '../constant/enums';
/**
 * When the Airflow call the ScheduleTrigger API will log in this table first.
 */
@Entity()
export class ScheduleTriggerLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: string;

  @Column({ name: 'partner_id' })
  public partnerId: string;

  @Column({
    name: 'campaign_type',
    nullable: true,
    default: ChannelType.EMAIL.toString(),
  })
  public campaignType: string;

  @Index()
  @Column({ name: 'opengpt_campaign_instance_id' })
  public opengptCampaignInstanceId: string;

  @Column({ name: 'remark', type: 'text', nullable: true })
  public remark: string;

  @Column({ name: 'dispatch_id', type: 'text', nullable: true })
  public dispatchId: string;

  @Index()
  @Column({ name: 'schedule_id', default: 'unknown' })
  public scheduleId: string;

  @Column({
    name: 'audience',
    type: 'text',
    array: true,
    default: [],
    nullable: true,
  })
  public audience: string[];

  @Column({ name: 'audience_size', nullable: true })
  public audienceSize: number;

  @Column({ default: OneStepStatus.DONE })
  public status: OneStepStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  public errorMessage: string;

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
}
