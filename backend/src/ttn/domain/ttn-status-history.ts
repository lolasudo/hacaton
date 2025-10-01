import { TTNStatus } from './ttn-status.enum';

export class TTNStatusHistory {
  id: number;
  ttnId: number;
  status: TTNStatus;
  userId: number;
  comment?: string;
  createdAt: Date;
}