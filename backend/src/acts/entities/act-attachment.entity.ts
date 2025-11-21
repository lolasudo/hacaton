import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActEntity } from './act.entity';
import { UserEntity } from '../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity('act_attachments')
export class ActAttachmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @ManyToOne(() => ActEntity, (act) => act.attachments)
  @JoinColumn({ name: 'act_id' })
  act: ActEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}