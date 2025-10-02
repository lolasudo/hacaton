import { Injectable, Inject } from '@nestjs/common';
import { CreateObjectDto } from '../dto/create-object.dto';
import { UpdateObjectDto } from '../dto/update-object.dto';
import { ConstructionObject } from '../domain/construction-object';
import { ConstructionObjectRepository } from '../infrastructure/persistence/construction-object.repository';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class ConstructionObjectsService {
  constructor(
    @Inject('ConstructionObjectRepository')
    private readonly constructionObjectsRepository: ConstructionObjectRepository,
  ) {}
  async create(createDto: CreateObjectDto, customerId: number): Promise<ConstructionObject> {
    const object = new ConstructionObject({});
    object.name = createDto.name;
    object.address = createDto.address;
    object.polygon = createDto.polygon;
    object.customerId = customerId; // Заказчик - тот кто создает
    object.contractorId = createDto.contractorId; // Назначенный прораб
    object.status = 'planned';
    object.startDate = createDto.startDate;
    object.endDate = createDto.endDate;
    object.createdAt = new Date();
    object.updatedAt = new Date();

    return this.constructionObjectsRepository.create(object);
  }

  async findById(id: number): Promise<NullableType<ConstructionObject>> {
    return this.constructionObjectsRepository.findById(id);
  }

  async findByCustomerId(customerId: number): Promise<ConstructionObject[]> {
    return this.constructionObjectsRepository.findByCustomerId(customerId);
  }

  async findByContractorId(contractorId: number): Promise<ConstructionObject[]> {
    return this.constructionObjectsRepository.findByContractorId(contractorId);
  }

  async update(id: number, updateDto: UpdateObjectDto): Promise<ConstructionObject> {
    return this.constructionObjectsRepository.update(id, updateDto);
  }

  async remove(id: number): Promise<void> {
    return this.constructionObjectsRepository.remove(id);
  }

  async activateObject(id: number): Promise<ConstructionObject> {
    return this.constructionObjectsRepository.update(id, {
      status: 'active',
      updatedAt: new Date(),
    });
  }

  async completeObject(id: number): Promise<ConstructionObject> {
    return this.constructionObjectsRepository.update(id, {
      status: 'completed',
      updatedAt: new Date(),
    });
  }
}