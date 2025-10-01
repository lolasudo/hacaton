import { TTN } from '../../../../domain/ttn';
import { TTNEntity } from '../entities/ttn.entity';
import { TTNItemMapper } from './ttn-item.mapper';
import { TTNStatusHistoryMapper } from './ttn-status-history.mapper';
import { TTNStatus } from '../../../../domain/ttn-status.enum';

export class TTNMapper {
  static toDomain(raw: TTNEntity): TTN {
    const domain = new TTN();
    domain.id = raw.id;
    domain.invoiceNumber = raw.invoiceNumber;
    domain.invoiceDate = raw.invoiceDate;
    domain.supplier = raw.supplier;
    domain.carrier = raw.carrier;
    domain.vehicleNumber = raw.vehicleNumber;
    domain.driverName = raw.driverName;
    domain.constructionObjectId = raw.constructionObjectId;
    domain.contractorId = raw.contractorId;
    domain.status = raw.status as TTNStatus;
    domain.photoPath = raw.photoPath;
    domain.recognizedData = raw.recognizedData;
    domain.totalAmount = raw.totalAmount ? Number(raw.totalAmount) : undefined;
    domain.taxAmount = raw.taxAmount ? Number(raw.taxAmount) : undefined;
    
    domain.items = raw.items ? raw.items.map(item => TTNItemMapper.toDomain(item)) : [];
    domain.statusHistory = raw.statusHistory ? raw.statusHistory.map(history => TTNStatusHistoryMapper.toDomain(history)) : [];
    
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    return domain;
  }

  static toPersistence(domain: TTN): TTNEntity {
    const entity = new TTNEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.invoiceNumber = domain.invoiceNumber;
    entity.invoiceDate = domain.invoiceDate;
    entity.supplier = domain.supplier;
    entity.carrier = domain.carrier;
    entity.vehicleNumber = domain.vehicleNumber;
    entity.driverName = domain.driverName;
    entity.constructionObjectId = domain.constructionObjectId;
    entity.contractorId = domain.contractorId;
    entity.status = domain.status;
    entity.photoPath = domain.photoPath;
    entity.recognizedData = domain.recognizedData;
    entity.totalAmount = domain.totalAmount;
    entity.taxAmount = domain.taxAmount;
    
    if (domain.items) {
      entity.items = domain.items.map(item => TTNItemMapper.toPersistence(item));
    }
    
    if (domain.statusHistory) {
      entity.statusHistory = domain.statusHistory.map(history => TTNStatusHistoryMapper.toPersistence(history));
    }
    
    return entity;
  }
}