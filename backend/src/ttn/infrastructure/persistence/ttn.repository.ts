import { TTN } from '../../domain/ttn';
import { NullableType } from '../../../utils/types/nullable.type';

export abstract class TTNRepository {
  abstract create(data: TTN): Promise<TTN>;
  abstract findById(id: number): Promise<NullableType<TTN>>;
  abstract findByConstructionObjectId(constructionObjectId: number): Promise<TTN[]>;
  abstract findByContractorId(contractorId: number): Promise<TTN[]>;
  abstract update(id: number, payload: Partial<TTN>): Promise<TTN>;
}