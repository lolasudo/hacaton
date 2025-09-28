import { ConstructionObject } from '../../../../domain/construction-object';
import { ConstructionObjectEntity } from '../entities/construction-object.entity';

export class ConstructionObjectMapper {
  static toDomain(raw: ConstructionObjectEntity): ConstructionObject {
    const domain = new ConstructionObject();
    domain.id = raw.id;
    domain.name = raw.name;
    domain.address = raw.address;
    domain.polygon = raw.polygon;
    domain.customerId = raw.customerId;
    domain.contractorId = raw.contractorId;
    domain.status = raw.status as 'planned' | 'active' | 'completed' | 'suspended';
    domain.startDate = raw.startDate;
    domain.endDate = raw.endDate;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt || undefined; // ✅ Исправлено
    return domain;
  }

  static toPersistence(domain: ConstructionObject): ConstructionObjectEntity {
    const entity = new ConstructionObjectEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.address = domain.address;
    entity.polygon = domain.polygon;
    entity.customerId = domain.customerId;
    entity.contractorId = domain.contractorId;
    entity.status = domain.status;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    // ✅ deletedAt не устанавливаем - TypeORM сам управляет
    return entity;
  }
}