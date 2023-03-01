import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
  @Column({
    name: 'created_by',
    nullable: true,
  })
  public createdBy: string;
  @Column({
    name: 'updated_by',
    nullable: true,
  })
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
