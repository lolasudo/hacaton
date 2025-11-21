// src/ttn/infrastructure/persistence/relational/repositories/ttn.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TTNEntity } from '../entities/ttn.entity';
import { TTNMapper } from '../mappers/ttn.mapper';
import { TTN } from '../../../../domain/ttn';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { TTNRepository } from '../../ttn.repository';
import { TTNStatus } from '../../../../domain/ttn-status.enum';

@Injectable()
export class TTNRelationalRepository extends TTNRepository {
  constructor(
    @InjectRepository(TTNEntity)
    private readonly ttnRepository: Repository<TTNEntity>,
  ) {
    super();
  }

  
  async create(data: TTN): Promise<TTN> {
    const persistenceEntity = TTNMapper.toPersistence(data);
    const newEntity = await this.ttnRepository.save(
      this.ttnRepository.create(persistenceEntity),
    );
    return TTNMapper.toDomain(newEntity);
  }

  async findById(id: number): Promise<NullableType<TTN>> {
    const entity = await this.ttnRepository.findOne({
      where: { id },
      relations: ['constructionObject', 'contractor', 'items', 'statusHistory'], // Добавляем relations
    });
    return entity ? TTNMapper.toDomain(entity) : null;
  }

  async findByConstructionObjectId(constructionObjectId: number): Promise<TTN[]> {
    const entities = await this.ttnRepository.find({
      where: { constructionObjectId },
      relations: ['constructionObject', 'contractor', 'items', 'statusHistory'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => TTNMapper.toDomain(entity));
  }

  async findByContractorId(contractorId: number): Promise<TTN[]> {
    const entities = await this.ttnRepository.find({
      where: { contractorId },
      relations: ['constructionObject', 'contractor', 'items', 'statusHistory'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => TTNMapper.toDomain(entity));
  }

  async update(id: number, payload: Partial<TTN>): Promise<TTN> {
    const entity = await this.ttnRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('TTN not found');
    }

    const updatedEntity = await this.ttnRepository.save(
      this.ttnRepository.create(
        TTNMapper.toPersistence({
          ...TTNMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TTNMapper.toDomain(updatedEntity);
  }

  async findAll(filters: {
    constructionObjectId?: number;
    contractorId?: number;
    status?: TTNStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: TTN[]; total: number }> {
    const {
      constructionObjectId,
      contractorId,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = filters;

    const queryBuilder = this.ttnRepository
      .createQueryBuilder('ttn')
      .leftJoinAndSelect('ttn.items', 'items')
      .leftJoinAndSelect('ttn.statusHistory', 'statusHistory')
      .leftJoinAndSelect('ttn.constructionObject', 'constructionObject')
      .leftJoinAndSelect('ttn.contractor', 'contractor')
      .orderBy('ttn.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (constructionObjectId) {
      queryBuilder.andWhere('ttn.constructionObjectId = :constructionObjectId', { constructionObjectId });
    }

    if (contractorId) {
      queryBuilder.andWhere('ttn.contractorId = :contractorId', { contractorId });
    }

    if (status) {
      queryBuilder.andWhere('ttn.status = :status', { status });
    }

    if (dateFrom) {
      queryBuilder.andWhere('ttn.invoiceDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('ttn.invoiceDate <= :dateTo', { dateTo });
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const data = entities.map(entity => TTNMapper.toDomain(entity));

    return { data, total };
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<TTN | null> {
    const entity = await this.ttnRepository.findOne({
      where: { invoiceNumber },
      relations: ['constructionObject', 'contractor', 'items', 'statusHistory'],
    });
    return entity ? TTNMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.ttnRepository.softDelete(id);
  }
}