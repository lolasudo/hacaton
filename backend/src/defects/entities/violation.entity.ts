import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ViolationStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  FIXED = 'fixed',
  VERIFIED = 'verified'
}

@Entity('violations')
export class Violation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ViolationStatus,
    default: ViolationStatus.OPEN
  })
  status: ViolationStatus;

  @Column()
  classificationCode: string;

  @Column()
  classificationDescription: string;

  // Геолокация
  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  // Фотографии
  @Column('jsonb', { default: [] })
  photos: string[];

  // 🔥 ВРЕМЕННО ПРОСТЫЕ COLUMNS БЕЗ СВЯЗЕЙ
  @Column()
  objectId: number;

  @Column()
  createdById: number;

  @Column({ nullable: true })
  assignedToId: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Лабораторные пробы (по ТЗ)
  @Column({ default: false })
  requiresLabSamples: boolean;

  @Column({ nullable: true })
  labSampleDetails: string;
}