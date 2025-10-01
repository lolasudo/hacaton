import { TTNItem } from '../../../../domain/ttn-item';
import { TTNItemEntity } from '../entities/ttn-item.entity';

export class TTNItemMapper {
  static toDomain(raw: TTNItemEntity): TTNItem {
    const domain = new TTNItem();
    domain.id = raw.id;
    domain.ttnId = raw.ttnId;
    domain.materialName = raw.materialName;
    domain.materialCode = raw.materialCode;
    domain.quantity = Number(raw.quantity);
    domain.unit = raw.unit;
    domain.price = raw.price ? Number(raw.price) : undefined;
    domain.totalAmount = raw.totalAmount ? Number(raw.totalAmount) : undefined;
    domain.batchNumber = raw.batchNumber;
    domain.qualityDocuments = raw.qualityDocuments || [];
    domain.matchedMaterialId = raw.matchedMaterialId;
    domain.matchConfidence = raw.matchConfidence ? Number(raw.matchConfidence) : undefined;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    return domain;
  }

  static toPersistence(domain: TTNItem): TTNItemEntity {
    const entity = new TTNItemEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.ttnId = domain.ttnId;
    entity.materialName = domain.materialName;
    entity.materialCode = domain.materialCode;
    entity.quantity = domain.quantity;
    entity.unit = domain.unit;
    entity.price = domain.price;
    entity.totalAmount = domain.totalAmount;
    entity.batchNumber = domain.batchNumber;
    entity.qualityDocuments = domain.qualityDocuments;
    entity.matchedMaterialId = domain.matchedMaterialId;
    entity.matchConfidence = domain.matchConfidence;
    return entity;
  }
}