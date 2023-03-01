import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { ChannelType } from '../constant/enums';
import { Journeys } from './journeys.entity';

@Entity()
export class Campaigns {
  @PrimaryGeneratedColumn('uuid', { name: 'opengpt_campaign_id' })
  public opengptCampaignId: string;

  @Column({ name: 'opengpt_journey_id', nullable: true })
  public opengptJourneyId: string;

  @Column({ name: 'opengpt_campaign_name' })
  public opengptCampaignName: string;

  @Column({ name: 'opengpt_campaign_description', nullable: true })
  public opengptCampaignDescription: string;

  @Column({ name: 'channel', default: ChannelType.EMAIL })
  public channel: string;

  @Column({ name: 'braze_template_id', nullable: true })
  public brazeTemplateId: string;

  @Column({ name: 'braze_campaign_id', nullable: true })
  public brazeCampaignId: string;

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

  @ManyToOne(type => Journeys, journey => journey.opengptJourneyId)
  @JoinColumn({ name: 'journey_opengpt_journey_id' })
  journey: Journeys;
}
