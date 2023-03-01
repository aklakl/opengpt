import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PartnerConfigurationItem {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column({ name: 'partner_id' })
  public partnerId: string;
  @Column({ name: 'parent_item', nullable: true })
  public parentItem: string;
  @Column({ name: 'item' })
  public item: string;
  @Column({ name: 'value', type: 'json' })
  public value: any;
  @Column({ name: 'is_default', type: 'boolean', nullable: true })
  public isDefault: boolean;
}
