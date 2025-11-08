import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ConstructionObjectEntity } from '../../construction-objects/infrastructure/persistence/relational/entities/construction-object.entity';
import { UserEntity } from '../../users/infrastructure/persistence/relational/entities/user.entity';
import { ActAttachmentEntity } from './act-attachment.entity';

export enum ActType {
  OPENING = 'opening',
  CLOSING = 'closing', 
  INTERMEDIATE = 'intermediate'
}

@Entity('acts')
export class ActEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  actNumber: string;

  @ManyToOne(() => ConstructionObjectEntity)
  @JoinColumn({ name: 'object_id' })
  object: ConstructionObjectEntity;

  @Column({
    type: 'enum',
    enum: ActType,
    default: ActType.INTERMEDIATE
  })
  type: ActType;

  @Column('text')
  content: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => ActAttachmentEntity, (attachment) => attachment.act)
  attachments: ActAttachmentEntity[];
}