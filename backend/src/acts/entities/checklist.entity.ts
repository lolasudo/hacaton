import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ActEntity } from './act.entity';
import { ConstructionObjectEntity } from '../../construction-objects/infrastructure/persistence/relational/entities/construction-object.entity';
import { UserEntity } from '../../users/infrastructure/persistence/relational/entities/user.entity';
import { ChecklistItemEntity } from './checklist-item.entity';

export enum ChecklistType {
  OBJECT_OPENING = 'object_opening',
  QUALITY_CONTROL = 'quality_control',
  SAFETY_INSPECTION = 'safety_inspection'
}

@Entity('checklists')
export class ChecklistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ChecklistType
  })
  type: ChecklistType;

  @ManyToOne(() => ActEntity, { nullable: true })
  @JoinColumn({ name: 'act_id' })
  act: ActEntity;

  @ManyToOne(() => ConstructionObjectEntity)
  @JoinColumn({ name: 'object_id' })
  object: ConstructionObjectEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ChecklistItemEntity, (item: ChecklistItemEntity) => item.checklist)
  items: ChecklistItemEntity[];
}