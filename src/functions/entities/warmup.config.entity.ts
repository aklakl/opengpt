import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class WarmupConfig extends Base {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'initial_count', nullable: true })
  public initialCount: number;

  @Column({ name: 'initial_step', nullable: true })
  public initialStep: number;

  @Column({
    name: 'warning_bounce_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  public warningBounceRate: number;

  @Column({
    name: 'warning_receivers',
    type: 'text',
    array: true,
    nullable: true,
  })
  public warningReceivers: string[];

  @Column({ name: 'external_config', type: 'json', nullable: true })
  public externalConfig: JSON;
}
