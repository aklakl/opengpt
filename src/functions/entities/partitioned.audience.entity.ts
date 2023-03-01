import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { OneStepStatus } from '../constant/enums';
import { Base } from './base.entity';

@Entity()
export class PartitionedAudience extends Base {
  @PrimaryGeneratedColumn('identity')
  public id: string;

  @Index()
  @Column({
    name: 'opengpt_campaign_instance_id',
    length: 64,
  })
  public opengptCampaignInstanceId: string;

  @Index()
  @Column({ name: 'schedule_id', length: 32 })
  public scheduleId: string;

  @Column({ name: 'token', length: 32 })
  public token: string;

  @Column({ default: OneStepStatus.TODO })
  public status: OneStepStatus;
}
