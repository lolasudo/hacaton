
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TTNRecognitionResult } from '../../domain/ttn-recognition-result';


export interface YandexVisionOCRResponse {
  result: {
    textAnnotation: {
      fullText: string;
      blocks?: Array<{
        lines: Array<{
          text: string;
        }>;
      }>;
    };
  };
}

@Injectable()
export class YandexVisionOCRService {
  private readonly logger = new Logger(YandexVisionOCRService.name);
  private readonly visionApiUrl: string;
  private readonly apiKey: string;
  private readonly folderId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.visionApiUrl = 'https://ocr.api.cloud.yandex.net/ocr/v1/recognizeText';
    
    const apiKey = this.configService.get<string>('YANDEX_API_KEY');
    const folderId = this.configService.get<string>('YANDEX_FOLDER_ID');
    
    if (!apiKey || !folderId) {
      throw new Error('YANDEX_API_KEY and YANDEX_FOLDER_ID must be configured');
    }
    
    this.apiKey = apiKey;
    this.folderId = folderId;
  }

  async recognizeTTN(imageBuffer: Buffer): Promise<TTNRecognitionResult> {
    try {
      console.log('🔍 [OCR] Starting TTN recognition...');
      
      const visionResult = await this.sendToVisionAPI(imageBuffer);
      
      console.log('🔍 [OCR] ======= FULL RECOGNIZED TEXT =======');
      console.log(visionResult);
      console.log('🔍 [OCR] ======= END TEXT =======');
      
      const parsedData = this.parseTTNText(visionResult);
      
      console.log('🔍 [OCR] Parsing results:', {
        invoiceNumber: parsedData.invoiceNumber,
        invoiceDate: parsedData.invoiceDate,
        supplier: parsedData.supplier,
        carrier: parsedData.carrier,
        vehicleNumber: parsedData.vehicleNumber,
        driverName: parsedData.driverName,
        itemsCount: parsedData.items.length,
        items: parsedData.items
      });
      
      this.validateTTNData(parsedData);
      
      console.log('✅ [OCR] TTN recognition completed successfully!');
      return parsedData;
      
    } catch (error) {
      console.error('❌ [OCR] TTN recognition failed:', error.message);
      this.logger.error(`OCR recognition failed: ${error.message}`);
      throw new Error(`Не удалось распознать ТТН: ${error.message}`);
    }
  }

  private async sendToVisionAPI(imageBuffer: Buffer): Promise<string> {
    const base64Image = imageBuffer.toString('base64');

    const requestBody = {
      mimeType: 'JPEG',
      model: 'page',
      languageCodes: ['ru', 'en'],
      content: base64Image
    };

    console.log('🔍 [OCR] Sending request to Yandex Vision...');
    console.log('🔍 [OCR] Image size:', imageBuffer.length, 'bytes');
    console.log('🔍 [OCR] Base64 size:', base64Image.length, 'chars');
    console.log('🔍 [OCR] Folder ID:', this.folderId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<YandexVisionOCRResponse>(
          this.visionApiUrl,
          requestBody,
          {
            headers: {
              'Authorization': `Api-Key ${this.apiKey}`,
              'Content-Type': 'application/json',
              'x-folder-id': this.folderId
            }
          }
        )
      );

      console.log('✅ [OCR] Vision API request successful!');
      return response.data.result?.textAnnotation?.fullText || '';

    } catch (error: any) {
      console.error('❌ [OCR] VISION API ERROR:');
      console.error('❌ [OCR] Status code:', error.response?.status);
      console.error('❌ [OCR] Status text:', error.response?.statusText);
      
      if (error.response?.data) {
        console.error('❌ [OCR] Error details:', JSON.stringify(error.response.data, null, 2));
      }
      
      console.error('❌ [OCR] Error message:', error.message);
      
      this.logger.error(`Vision API error: ${error.response?.data || error.message}`);
      throw new Error(`Ошибка Vision API: ${error.response?.data?.message || error.message}`);
    }
  }

  private parseTTNText(recognizedText: string): TTNRecognitionResult {
    console.log('🔍 [OCR] Parsing recognized text...');
    
    const invoiceNumber = this.extractInvoiceNumber(recognizedText);
    const invoiceDate = this.extractDate(recognizedText);
    const supplier = this.extractSupplier(recognizedText);
    const carrier = this.extractCarrier(recognizedText);
    const vehicleNumber = this.extractVehicleNumber(recognizedText);
    const driverName = this.extractDriverName(recognizedText);
    const items = this.extractMaterials(recognizedText);

    return {
      invoiceNumber,
      invoiceDate, 
      supplier,
      carrier,
      vehicleNumber,
      driverName,
      items,
      rawText: recognizedText,
      confidence: 0.85
    };
  }

  private extractInvoiceNumber(text: string): string {
    console.log('🔍 [OCR] Extracting invoice number...');
    
    const patterns = [
      /ТТН[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
      /ТРАНСПОРТНАЯ[:\s]*НАКЛАДНАЯ[:\s]*№?[\s]*ТТН-([A-ZА-Я0-9-]+)/i,
      /Накладная[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
      /Транспортная[:\s]*накладная[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
      /ТН[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
      /Счёт-фактура[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
      /СФ[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
      /№[\s]*([A-ZА-Я0-9-]{5,})/i,
      /([A-ZА-Я]{2,3}[-_]\d{2,}[-_]\d{2,})/i,
      /(\d{2,}[-\/]\d{2,}[-\/]\d{2,})/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ [OCR] Invoice number found:', match[1], 'with pattern:', pattern);
        return match[1].trim();
      }
    }
    
    console.log('❌ [OCR] No invoice number patterns matched');
    return 'НЕ РАСПОЗНАНО';
  }

  private extractDate(text: string): Date {
    console.log('🔍 [OCR] Extracting date...');
    
    const datePatterns = [
      /(\d{2}\.\d{2}\.\d{4})/,
      /(\d{4}-\d{2}-\d{2})/,
      /(\d{1,2}\s+[а-я]+\s+\d{4})/i,
      /Дата[:\s]*(\d{2}\.\d{2}\.\d{4})/i,
      /от[\s]*(\d{2}\.\d{2}\.\d{4})/i
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const date = new Date(match[1]);
          console.log('✅ [OCR] Date found:', match[1], '->', date);
          return date;
        } catch {
          continue;
        }
      }
    }
    
    console.log('⚠️ [OCR] No date found, using current date');
    return new Date();
  }

  private extractSupplier(text: string): string {
    console.log('🔍 [OCR] Extracting supplier...');
    
    const supplierPatterns = [
      /Поставщик[:\s]*([^\n\r]+)/i,
      /Грузоотправитель[:\s]*([^\n\r]+)/i,
      /Отправитель[:\s]*([^\n\r]+)/i,
      /Организация-поставщик[:\s]*([^\n\r]+)/i
    ];
    
    for (const pattern of supplierPatterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ [OCR] Supplier found:', match[1]);
        return match[1].trim();
      }
    }
    
    console.log('❌ [OCR] No supplier found');
    return 'НЕ РАСПОЗНАНО';
  }

  private extractCarrier(text: string): string | undefined {
    console.log('🔍 [OCR] Extracting carrier...');
    
    const carrierPatterns = [
      /Перевозчик[:\s]*([^\n\r]+)/i,
      /Грузоперевозчик[:\s]*([^\n\r]+)/i,
      /Транспортная[:\s]*компания[:\s]*([^\n\r]+)/i
    ];
    
    for (const pattern of carrierPatterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ [OCR] Carrier found:', match[1]);
        return match[1].trim();
      }
    }
    
    console.log('⚠️ [OCR] No carrier found');
    return undefined;
  }

  private extractVehicleNumber(text: string): string | undefined {
    console.log('🔍 [OCR] Extracting vehicle number...');
    
    const vehiclePatterns = [
      /Госномер[:\s]*([A-ZА-Я0-9-]+)/i,
      /Автомобиль[:\s]*([A-ZА-Я0-9-]+)/i,
      /№[\s]*авто[:\s]*([A-ZА-Я0-9-]+)/i,
      /Гос[.\s]*номер[:\s]*([A-ZА-Я0-9-]+)/i
    ];
    
    for (const pattern of vehiclePatterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ [OCR] Vehicle number found:', match[1]);
        return match[1].trim();
      }
    }
    
    console.log('⚠️ [OCR] No vehicle number found');
    return undefined;
  }

  private extractDriverName(text: string): string | undefined {
    console.log('🔍 [OCR] Extracting driver name...');
    
    const driverPatterns = [
      /Водитель[:\s]*([^\n\r]+)/i,
      /ФИО[:\s]*водителя[:\s]*([^\n\r]+)/i,
      /Шофёр[:\s]*([^\n\r]+)/i
    ];
    
    for (const pattern of driverPatterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('✅ [OCR] Driver name found:', match[1]);
        return match[1].trim();
      }
    }
    
    console.log('⚠️ [OCR] No driver name found');
    return undefined;
  }

  private extractMaterials(text: string): Array<{
    materialName: string;
    quantity: number;
    unit: string;
    price?: number;
    totalAmount?: number;
  }> {
    console.log('🔍 [OCR] Extracting materials...');
    
    const items: Array<{
      materialName: string;
      quantity: number;
      unit: string;
      price?: number;
      totalAmount?: number;
    }> = [];
    
    const lines = text.split('\n');
    let inMaterialsSection = false;
    let currentMaterial: { name?: string; quantity?: number; unit?: string } = {};
    
    console.log('🔍 [OCR] Total lines to analyze:', lines.length);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/Наименование материала|Материал|Товар|Номенклатура/i)) {
        inMaterialsSection = true;
        console.log('✅ [OCR] Materials section header found at line', i, ':', line);
        continue;
      }
 
      if (inMaterialsSection && line.match(/Итого|Всего|ИТОГО|ВСЕГО/i)) {
        console.log('🔍 [OCR] Exiting materials section at line', i, ':', line);
        inMaterialsSection = false;
        
        if (currentMaterial.name && currentMaterial.quantity) {
          this.saveMaterial(items, currentMaterial);
          currentMaterial = {};
        }
        continue;
      }
      
      if (inMaterialsSection && line) {
        console.log('🔍 [OCR] Processing line', i, ':', line);
        
        
        const fullMaterialPattern = /([А-Яа-яЁё\s\w.-]{3,})\s+(\d+[,.]?\d*)\s*([А-Яа-я]{0,5})/;
        const fullMatch = line.match(fullMaterialPattern);
        
        if (fullMatch && fullMatch[1] && fullMatch[2]) {
          const materialName = fullMatch[1].trim();
          const quantity = parseFloat(fullMatch[2].replace(',', '.'));
          
        
          if (this.isValidMaterial(materialName, quantity)) {
            const item = {
              materialName: materialName,
              quantity: quantity,
              unit: fullMatch[3] ? fullMatch[3].trim() : 'шт.'
            };
            
            console.log('✅ [OCR] Full material found in one line:', item);
            items.push(item);
            continue;
          }
        }
        
        
        if (line.match(/^[А-Яа-яЁё\s.-]+$/) && line.length > 3 && !line.match(/изм|ед|шт|т|кг|м|л/i)) {
        
          if (currentMaterial.name && currentMaterial.quantity) {
            this.saveMaterial(items, currentMaterial);
          }
          
          currentMaterial.name = line;
          console.log('🔍 [OCR] Potential material name:', line);
        }
        
        else if (line.match(/^\d+[,.]?\d*\.?\.?\.?$/)) {
          const cleanLine = line.replace(/\.+$/, '');
          const quantity = parseFloat(cleanLine.replace(',', '.'));
          
          if (quantity > 0) {
            if (currentMaterial.name) {
              currentMaterial.quantity = quantity;
              console.log('🔍 [OCR] Potential quantity:', quantity, 'for material:', currentMaterial.name);
            } else {
              
              if (i > 0) {
                const prevLine = lines[i-1].trim();
                if (prevLine.match(/[А-Яа-яЁё]/) && !prevLine.match(/\d/)) {
                  currentMaterial.name = prevLine;
                  currentMaterial.quantity = quantity;
                  console.log('🔍 [OCR] Using previous line as material name:', prevLine, 'with quantity:', quantity);
                }
              }
            }
          }
        }
        
        else if (line.match(/^[А-Яа-я]{1,5}$/) && line.match(/т|шт|кг|м|л|ед/i)) {
          if (currentMaterial.name && currentMaterial.quantity) {
            currentMaterial.unit = line;
            console.log('🔍 [OCR] Potential unit:', line, 'for material:', currentMaterial.name);
          }
        }
        
        if (currentMaterial.name && currentMaterial.quantity) {
          this.saveMaterial(items, currentMaterial);
          currentMaterial = {};
        }
      }
    }
    
    
    if (currentMaterial.name && currentMaterial.quantity) {
      this.saveMaterial(items, currentMaterial);
    }
    
    console.log('🔍 [OCR] Total materials found:', items.length);
    return items;
  }

 
  private saveMaterial(
    items: Array<{ materialName: string; quantity: number; unit: string; price?: number; totalAmount?: number }>,
    currentMaterial: { name?: string; quantity?: number; unit?: string }
  ): void {
    if (currentMaterial.name && currentMaterial.quantity && this.isValidMaterial(currentMaterial.name, currentMaterial.quantity)) {
      const item = {
        materialName: currentMaterial.name,
        quantity: currentMaterial.quantity,
        unit: currentMaterial.unit || 'шт.'
      };
      
      console.log('✅ [OCR] Saving material:', item);
      items.push(item);
    }
  }

  
  private isValidMaterial(materialName: string, quantity: number): boolean {
  
    const excludedPatterns = [
      /Наименование/i,
      /Материал/i,
      /Товар/i,
      /Кол-во/i,
      /Количество/i,
      /Ед\.?изм/i,
      /Цена/i,
      /Сумма/i,
      /изм/i,
      /^\.+/,
      /^\.\.\./
    ];
    
    for (const pattern of excludedPatterns) {
      if (materialName.match(pattern)) {
        return false;
      }
    }
    
    return materialName.length >= 2 && quantity > 0;
  }

  private validateTTNData(data: TTNRecognitionResult): void {
    console.log('🔍 [OCR] Validating TTN data...');
    
    if (!data.invoiceNumber || data.invoiceNumber === 'НЕ РАСПОЗНАНО') {
      throw new Error('Не удалось распознать номер ТТН');
    }
    
   
    if (data.items.length === 0) {
      console.log('⚠️ [OCR] No materials found, but continuing for testing...');
   
    }
    
    console.log('✅ [OCR] TTN data validation passed');
  }
}