// src/defects/entities/defect.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DefectStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  FIXED = 'fixed',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export enum DefectPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

@Entity('defects')
export class Defect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: DefectStatus,
    default: DefectStatus.OPEN
  })
  status: DefectStatus;

  @Column({
    type: 'enum',
    enum: DefectPriority,
    default: DefectPriority.MEDIUM
  })
  priority: DefectPriority;

  @Column()
  category: string;

  // Геолокация
  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  // Фотографии
  @Column('simple-array', { nullable: true })
  photos: string[];

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

  // Дополнительные временные метки
  @Column({ type: 'timestamp', nullable: true })
  inProgressAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  fixedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  // Детали устранения
  @Column({ type: 'text', nullable: true })
  resolutionDetails: string;

  // Требуется верификация (для критических замечаний)
  @Column({ default: false })
  requiresVerification: boolean;
}