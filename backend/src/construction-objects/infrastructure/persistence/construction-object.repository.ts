
import { ConstructionObject } from '../../domain/construction-object';
import { NullableType } from '../../../utils/types/nullable.type';

export abstract class ConstructionObjectRepository {
  abstract create(data: ConstructionObject): Promise<ConstructionObject>;
  abstract find(): Promise<ConstructionObject[]>;
  abstract findById(id: number): Promise<NullableType<ConstructionObject>>;
  abstract findByCustomerId(customerId: number): Promise<ConstructionObject[]>;
  abstract findByContractorId(contractorId: number): Promise<ConstructionObject[]>;
  abstract update(id: number, payload: Partial<ConstructionObject>): Promise<ConstructionObject>;
  abstract remove(id: number): Promise<void>;
}