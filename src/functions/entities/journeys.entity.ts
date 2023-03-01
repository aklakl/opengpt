import {
  Column,
  CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Campaigns } from './campaigns.entity';
@Entity()
export class Journeys {
  @PrimaryGeneratedColumn('uuid', { name: 'opengpt_journey_id' })
  public opengptJourneyId: string;
  //if partner_id is null, the journey for all partner
  @Column({ name: 'partner_id', nullable: true })
  public partnerId: string;

  @Column({ name: 'opengpt_journey_name' })
  public opengptJourneyName: string;

  @Column({ name: 'journey_description', nullable: true })
  public journeyDescription: string;

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

  @OneToMany(type => Campaigns, campaigns => campaigns.opengptJourneyId)
  campaigns: Campaigns[];
}
