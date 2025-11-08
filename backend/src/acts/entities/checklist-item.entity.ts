import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChecklistEntity } from './checklist.entity';

@Entity('checklist_items')
export class ChecklistItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @ManyToOne(() => ChecklistEntity, checklist => checklist.items)
  @JoinColumn({ name: 'checklist_id' })
  checklist: ChecklistEntity;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}