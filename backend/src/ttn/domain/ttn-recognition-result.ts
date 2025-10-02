// src/ttn/domain/ttn-recognition-result.ts
export interface TTNRecognitionResult {
  invoiceNumber: string;
  invoiceDate: Date;
  supplier: string;
  carrier?: string;
  vehicleNumber?: string;
  driverName?: string;
  items: Array<{
    materialName: string;
    quantity: number;
    unit: string;
    price?: number;
    totalAmount?: number;
  }>;
  rawText: string;
  confidence: number;
}