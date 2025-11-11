// src/modules/reporting/entities/kpi.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ConstructionObjectEntity } from '../../construction-objects/infrastructure/persistence/relational/entities/construction-object.entity';

@Entity('kpi_metrics')
export class KPIMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['efficiency', 'quality', 'timeliness', 'safety', 'cost'] })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  target: number;

  @Column({ type: 'enum', enum: ['daily', 'weekly', 'monthly', 'quarterly'] })
  frequency: string;

  @ManyToOne(() => ConstructionObjectEntity, { nullable: true })
  @JoinColumn({ name: 'object_id' })
  object: ConstructionObjectEntity;

  @Column({ name: 'object_id', nullable: true, type: 'integer' })
  objectId?: number; // Изменено на optional number

  @Column({ type: 'date' })
  measurementDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}