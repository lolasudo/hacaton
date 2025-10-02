export class ConstructionObject {
  id: number;
  name: string;
  address: string;
  polygon: string; // Координаты полигона "lat,lng;lat,lng;..."
  customerId: number; // ID заказчика
  contractorId: number; // ID прораба
  status: 'planned' | 'active' | 'completed' | 'suspended';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // defects?: Defect[]; // Замечания службы контроля
  // violations?: Violation[]; // Нарушения контрольных органов

  constructor(partial: Partial<ConstructionObject>) {
    Object.assign(this, partial);
  }
}