import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type AuditLogEvent = 'INSERT' | 'UPDATE' | 'REMOVE';

@Entity('audit_logs')
@Index(['itemType', 'itemId'])
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column()
  itemType: string;

  @Column({ type: 'bigint' })
  itemId: string;

  @Column({ length: '15' })
  event: AuditLogEvent;

  @Column({ nullable: true })
  whodunnit: string;

  @Column({ type: 'json', nullable: true })
  object: any;

  @Column({ type: 'json', nullable: true })
  objectChanges: any;

  @CreateDateColumn()
  createdAt: Date;
}
