import {
  Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity()
@Index(['partnerId'], { unique: true })
//@Unique(["partnerId"])
export class PartnerConfigurationLogo {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'partner_id' })
  public partnerId: string;

  @Column({ name: 'logo', type: 'text', nullable: true })
  public logo: string;

  @Column({ name: 'icon', type: 'text', nullable: true })
  public icon: string;

  @Column({ name: 'color_primary', nullable: true })
  public colorPrimary: string;

  @Column({ name: 'color_secondary', nullable: true })
  public colorSecondary: string;

  @Column({ name: 'reply_to_addresses', type: 'text', nullable: true })
  public replyToAddresses: string;

  @Column({ name: 'enforce_from_or_replyto', nullable: true })
  public enforceFromOrReplyTo: boolean;

  @Column({ type: 'text', name: 'custom_footer', nullable: true })
  public customFooter: string;

  @Column({ name: 'set_plaintext_footer', nullable: true })
  public setPlaintextFooter: boolean;

  @Column({ name: 'company_name', type: 'text', nullable: true })
  public companyName: string;

  @Column({ name: 'introduction', type: 'text', nullable: true })
  public introduction: string;

  //if the record is custom_footer, no need to fill up the opengpt_campaign_instance_id(Because only logo/icon can relate to opengpt_campaign_instance_id)
  @Column({ name: 'opengpt_campaign_instance_id', nullable: true })
  public opengptCampaignInstanceId: string;

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
