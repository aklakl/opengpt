import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OneStepStatus } from '../constant/enums';
import { Base } from './base.entity';

@Entity()
export class WarmupDaySchedule extends Base {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'partner_id',
    length: 32,
    nullable: true,
  })
  public partnerId: string;

  @Column({
    name: 'opengpt_campaign_instance_id',
    length: 64,
  })
  public opengptCampaignInstanceId: string;

  @Column({
    name: 'schedule_id',
    length: 32,
  })
  public scheduleId: string;

  @Column({
    length: 16,
  })
  public day: string;

  @Column({
    enum: OneStepStatus,
    default: OneStepStatus.TODO,
  })
  public status: OneStepStatus;

  @Column({
    name: 'audience_size',
    nullable: true,
  })
  public audienceSize: number;
}
