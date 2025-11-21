import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, 
  DeleteDateColumn, ManyToOne, JoinColumn, OneToMany 
} from 'typeorm';
import { ConstructionObjectEntity } from '../../../../../construction-objects/infrastructure/persistence/relational/entities/construction-object.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TTNItemEntity } from './ttn-item.entity';
import { TTNStatusHistoryEntity } from './ttn-status-history.entity';

@Entity('ttn_documents')
export class TTNEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ name: 'invoice_date' })
  invoiceDate: Date;

  @Column()
  supplier: string;

  @Column({ nullable: true })
  carrier?: string; // ← Сделать nullable

  @Column({ name: 'vehicle_number', nullable: true })
  vehicleNumber?: string; // ← Сделать nullable

  @Column({ name: 'driver_name', nullable: true })
  driverName?: string; // ← Сделать nullable

  @Column({ name: 'construction_object_id' })
  constructionObjectId: number;

  @Column({ name: 'contractor_id' })
  contractorId: number;

  @Column({
    type: 'enum',
    enum: ['uploaded', 'recognizing', 'needs_review', 'verified', 'approved', 'rejected', 'processed'],
    default: 'uploaded'
  })
  status: string;

  @Column({ name: 'photo_path' })
  photoPath: string;

  @Column({ name: 'recognized_data', type: 'json', nullable: true })
  recognizedData?: any; // ← Сделать nullable

  @Column({ name: 'total_amount', type: 'decimal', nullable: true })
  totalAmount?: number; // ← Сделать nullable

  @Column({ name: 'tax_amount', type: 'decimal', nullable: true })
  taxAmount?: number; // ← Сделать nullable

 
  @ManyToOne(() => ConstructionObjectEntity)
  @JoinColumn({ name: 'construction_object_id' })
  constructionObject: ConstructionObjectEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'contractor_id' })
  contractor: UserEntity;

  @OneToMany(() => TTNItemEntity, item => item.ttn, { cascade: true })
  items: TTNItemEntity[];

  @OneToMany(() => TTNStatusHistoryEntity, history => history.ttn, { cascade: true })
  statusHistory: TTNStatusHistoryEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}