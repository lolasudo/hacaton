export class TTNItem {
  id: number;
  ttnId: number;
  materialName: string;
  materialCode?: string;
  quantity: number;
  unit: string;
  price?: number;
  totalAmount?: number;
  batchNumber?: string;
  qualityDocuments: string[] = []; 
  
  matchedMaterialId?: number;
  matchConfidence?: number;
  
  createdAt: Date;
  updatedAt: Date;
}