// src/modules/reporting/entities/dashboard.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Report } from './report.entity';

@Entity('dashboards')
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb' })
  layout: any;

  @Column({ type: 'jsonb' })
  widgets: any[];

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @OneToMany(() => Report, report => report.object)
  reports: Report[];

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}