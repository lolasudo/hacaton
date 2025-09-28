import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity('construction_objects')
export class ConstructionObjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'text' })
  polygon: string; // "55.7558,37.6176;55.7601,37.6176;..."

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'contractor_id' })
  contractorId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'contractor_id' })
  contractor: UserEntity;

  @Column({
    type: 'enum',
    enum: ['planned', 'active', 'completed', 'suspended'],
    default: 'planned'
  })
  status: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}