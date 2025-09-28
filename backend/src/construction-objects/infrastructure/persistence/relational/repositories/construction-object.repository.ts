import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstructionObjectEntity } from '../entities/construction-object.entity';
import { ConstructionObjectMapper } from '../mappers/construction-object.mapper';
import { ConstructionObject } from '../../../../domain/construction-object';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { ConstructionObjectRepository } from '../../construction-object.repository';

@Injectable()
export class ConstructionObjectRelationalRepository extends ConstructionObjectRepository {
  constructor(
    @InjectRepository(ConstructionObjectEntity)
    private readonly constructionObjectsRepository: Repository<ConstructionObjectEntity>,
  ) {
    super();
  }
  async create(data: ConstructionObject): Promise<ConstructionObject> {
    const persistenceEntity = ConstructionObjectMapper.toPersistence(data);
    const newEntity = await this.constructionObjectsRepository.save(
      this.constructionObjectsRepository.create(persistenceEntity),
    );
    return ConstructionObjectMapper.toDomain(newEntity);
  }

  async findById(id: number): Promise<NullableType<ConstructionObject>> {
    const entity = await this.constructionObjectsRepository.findOne({
      where: { id },
      relations: ['customer', 'contractor'],
    });
    return entity ? ConstructionObjectMapper.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: number): Promise<ConstructionObject[]> {
    const entities = await this.constructionObjectsRepository.find({
      where: { customerId },
      relations: ['customer', 'contractor'],
    });
    return entities.map((entity) => ConstructionObjectMapper.toDomain(entity));
  }

  async findByContractorId(contractorId: number): Promise<ConstructionObject[]> {
    const entities = await this.constructionObjectsRepository.find({
      where: { contractorId },
      relations: ['customer', 'contractor'],
    });
    return entities.map((entity) => ConstructionObjectMapper.toDomain(entity));
  }

  async update(id: number, payload: Partial<ConstructionObject>): Promise<ConstructionObject> {
    const entity = await this.constructionObjectsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Construction object not found');
    }

    const updatedEntity = await this.constructionObjectsRepository.save(
      this.constructionObjectsRepository.create(
        ConstructionObjectMapper.toPersistence({
          ...ConstructionObjectMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ConstructionObjectMapper.toDomain(updatedEntity);
  }

  async remove(id: number): Promise<void> {
    await this.constructionObjectsRepository.softDelete(id);
  }
}