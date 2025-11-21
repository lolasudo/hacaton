import { Injectable } from '@nestjs/common';

export interface TTNRecognitionResult {  // ← ПЕРЕНЕСТИ интерфейс сюда
  invoiceNumber: string;
  invoiceDate: Date;
  supplier: string;
  materialName: string;
  quantity: number;
  unit: string;
  confidence: number;
  rawText: string;
}

@Injectable()
export class LocalOCRService {
  async recognizeTTN(imageBuffer: Buffer): Promise<TTNRecognitionResult> {
 
    console.log('🔍 Local OCR processing TTN...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      invoiceNumber: `ТТН-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      invoiceDate: new Date(),
      supplier: 'ООО "Тестовый Поставщик"',
      materialName: 'Бетон М300',
      quantity: 15.5,
      unit: 'м³',
      confidence: 0.92,
      rawText: 'ТРАНСПОРТНАЯ НАКЛАДНАЯ № ТТН-123456...'
    };
  }
}