// src/modules/reporting/entities/report.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ConstructionObjectEntity } from '../../construction-objects/infrastructure/persistence/relational/entities/construction-object.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ['readiness', 'defects', 'violations', 'performance', 'custom'] })
  type: string;

  @Column({ type: 'jsonb' })
  filters: any;

  @Column({ type: 'jsonb' })
  data: any;

  @Column({ type: 'enum', enum: ['draft', 'generated', 'archived'] })
  status: string;

  @ManyToOne(() => ConstructionObjectEntity)
  @JoinColumn({ name: 'object_id' })
  object: ConstructionObjectEntity;

  @Column({ name: 'object_id', nullable: true })
  objectId: string;

  @Column({ type: 'timestamp', nullable: true })
  generatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;
}