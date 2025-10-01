import { TTNStatusHistory } from '../../../../domain/ttn-status-history';
import { TTNStatusHistoryEntity } from '../entities/ttn-status-history.entity';
import { TTNStatus } from '../../../../domain/ttn-status.enum';

export class TTNStatusHistoryMapper {
  static toDomain(raw: TTNStatusHistoryEntity): TTNStatusHistory {
    const domain = new TTNStatusHistory();
    domain.id = raw.id;
    domain.ttnId = raw.ttnId;
    domain.status = raw.status as TTNStatus;
    domain.userId = raw.userId;
    domain.comment = raw.comment;
    domain.createdAt = raw.createdAt;
    return domain;
  }

  static toPersistence(domain: TTNStatusHistory): TTNStatusHistoryEntity {
    const entity = new TTNStatusHistoryEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.ttnId = domain.ttnId;
    entity.status = domain.status;
    entity.userId = domain.userId;
    entity.comment = domain.comment;
    return entity;
  }
}