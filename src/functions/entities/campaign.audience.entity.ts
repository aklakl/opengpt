import {
  Column,
  CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { CampaignsPartner } from './campaigns.partner.entity';

/*
  CampaignAudience map to Generate audience(segment)
*/
@Entity()
export class CampaignAudience {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: string;

  @Column({ name: 'opengpt_campaign_instance_id' })
  public opengptCampaignInstanceId: string;

  @Column({ name: 'segment_name', nullable: true })
  public segmentName: string;

  //This is generateSegmentId from generate microservices
  @Column({ name: 'segment_id', nullable: true })
  public segmentId: string;

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

  @ManyToOne(
    type => CampaignsPartner,
    campaignsPartner => campaignsPartner.opengptCampaignInstanceId,
  )
  @JoinColumn({ name: 'campaigns_partner_opengpt_campaign_instance_id' })
  campaignsPartner: CampaignsPartner;
}
