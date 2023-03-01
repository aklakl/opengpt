import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { BrazeCustomer } from './braze.customer.entity';

//used to store the custom attributes.
@Entity()
export class BrazeCustomAttribute {
  @PrimaryGeneratedColumn()
  public id: number;

  //relate to BrazeCustomer's external_id
  @Column({ name: 'external_id' })
  public externalId: string;

  @Column({ name: 'attribute_name' })
  public attributeName: string;

  @Column({ name: 'attribute_value' })
  public attributeValue: string;

  @ManyToOne(type => BrazeCustomer, brazeCustomer => brazeCustomer.externalId)
  @JoinColumn({ name: 'braze_customer_id' })
  brazeCustomer: BrazeCustomer;

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
