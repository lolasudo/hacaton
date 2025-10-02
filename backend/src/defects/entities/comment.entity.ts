// src/defects/entities/comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column({ nullable: true })
  defectId: number;

  @Column({ nullable: true })
  violationId: number;

  @Column({ nullable: true }) 
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'user' })
  type: string;
}