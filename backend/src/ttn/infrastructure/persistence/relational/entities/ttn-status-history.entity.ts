import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { TTNEntity } from './ttn.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity('ttn_status_history')
export class TTNStatusHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ttn_id' })
  ttnId: number;

  @Column({
    type: 'enum',
    enum: ['uploaded', 'recognizing', 'needs_review', 'verified', 'approved', 'rejected', 'processed']
  })
  status: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text', nullable: true })
  comment?: string; // ← Используем ? вместо null

  @ManyToOne(() => TTNEntity)
  @JoinColumn({ name: 'ttn_id' })
  ttn: TTNEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}