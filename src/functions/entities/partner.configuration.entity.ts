import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PartnerConfigurations {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'partner_id' })
  public partnerId: string;

  @Column({ name: 'from_display_name' })
  public fromDisplayName: string;

  @Column({ name: 'local_part' })
  public localPart: string;

  @Column({ name: 'is_default' })
  public isDefault: boolean;

  @Column({ name: 'email_domain' })
  public emailDomain: string;

  @Column({ name: 'email_ip_pool' })
  public emailIpPool: string;

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
