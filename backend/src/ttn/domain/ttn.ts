import { TTNStatus } from './ttn-status.enum';
import { TTNItem } from './ttn-item';
import { TTNStatusHistory } from './ttn-status-history';

export class TTN {
  id: number;
  invoiceNumber: string;
  invoiceDate: Date;
  supplier: string;
  carrier?: string;
  vehicleNumber?: string;
  driverName?: string;
  
  constructionObjectId: number;
  contractorId: number;
  status: TTNStatus;
  
  photoPath: string;
  recognizedData?: any;
  
  totalAmount?: number;
  taxAmount?: number;
  
  items: TTNItem[] = []; // Инициализируем пустым массивом
  statusHistory?: TTNStatusHistory[];
  
  createdAt: Date;
  updatedAt: Date;
}