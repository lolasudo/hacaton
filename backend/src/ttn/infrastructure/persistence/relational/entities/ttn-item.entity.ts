import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TTNEntity } from './ttn.entity';

@Entity('ttn_items')
export class TTNItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ttn_id' })
  ttnId: number;

  @Column({ name: 'material_name' })
  materialName: string;

  @Column({ name: 'material_code', nullable: true })
  materialCode?: string;

  @Column('decimal')
  quantity: number;

  @Column()
  unit: string;

  @Column('decimal', { nullable: true })
  price?: number;

  @Column({ name: 'total_amount', type: 'decimal', nullable: true })
  totalAmount?: number;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber?: string;

  @Column({ name: 'quality_documents', type: 'json', nullable: true })
  qualityDocuments?: string[];

  @Column({ name: 'matched_material_id', nullable: true })
  matchedMaterialId?: number;

  @Column({ name: 'match_confidence', type: 'decimal', nullable: true })
  matchConfidence?: number;

  @ManyToOne(() => TTNEntity, ttn => ttn.items)
  @JoinColumn({ name: 'ttn_id' })
  ttn: TTNEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}