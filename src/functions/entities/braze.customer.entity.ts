import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BrazeCustomAttribute } from './braze.custom.attribute.entity';
@Entity()
@Unique(['externalId'])
export class BrazeCustomer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'external_id' })
  public externalId: string;

  @Column({ name: 'partner_id' })
  public partnerId: string;

  @Column({ name: 'customer_id' })
  public customerId: string;

  @Column({ name: 'location_id' })
  public locationId: string;

  @Column({ name: 'email_domain' })
  public emailDomain: string;

  @Column({ name: 'created_by', nullable: true })
  public createdBy: string;
  @Column({ name: 'updated_by', nullable: true })
  public updatedBy: string;

  @OneToMany(
    type => BrazeCustomAttribute,
    brazeCustomAttribute => brazeCustomAttribute.externalId,
  )
  brazeCustomAttributes: BrazeCustomAttribute[];
  //@OneToMany(type => BrazeCustomAttribute) @JoinColumn()

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
