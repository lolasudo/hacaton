// // src/ttn/infrastructure/ocr/yandex-vision-ocr.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { firstValueFrom } from 'rxjs';
// import { TTNRecognitionResult } from '../domain/ttn-recognition-result';

// export interface YandexVisionResponse {
//   results: Array<{
//     recognition: {
//       text: string;
//     };
//   }>;
// }

// @Injectable()
// export class YandexVisionOCRService {
//   private readonly logger = new Logger(YandexVisionOCRService.name);
//   private readonly visionApiUrl: string;
//   private readonly iamToken: string;
//   private readonly folderId: string;

//   constructor(
//     private readonly httpService: HttpService,
//     private readonly configService: ConfigService,
//   ) {
//     this.visionApiUrl = 'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze';
//     this.iamToken = this.configService.get('YANDEX_IAM_TOKEN');
//     this.folderId = this.configService.get('YANDEX_FOLDER_ID');
//   }

//   async recognizeTTN(imageBuffer: Buffer): Promise<TTNRecognitionResult> {
//     try {
//       // 1. Отправляем изображение в Яндекс Vision API
//       const visionResult = await this.sendToVisionAPI(imageBuffer);
      
//       // 2. Парсим распознанный текст
//       const parsedData = this.parseTTNText(visionResult);
      
//       // 3. Валидируем данные
//       this.validateTTNData(parsedData);
      
//       return parsedData;
//     } catch (error) {
//       this.logger.error(`OCR recognition failed: ${error.message}`);
//       throw new Error(`Не удалось распознать ТТН: ${error.message}`);
//     }
//   }

//   private async sendToVisionAPI(imageBuffer: Buffer): Promise<string> {
//     const base64Image = imageBuffer.toString('base64');

//     const requestBody = {
//       folderId: this.folderId,
//       analyze_specs: [{
//         content: base64Image,
//         features: [{
//           type: 'TEXT_DETECTION',
//           text_detection_config: {
//             language_codes: ['ru', 'en']
//           }
//         }]
//       }]
//     };

//     const response = await firstValueFrom(
//       this.httpService.post<YandexVisionResponse>(
//         this.visionApiUrl,
//         requestBody,
//         {
//           headers: {
//             'Authorization': `Bearer ${this.iamToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       )
//     );

//     // Извлекаем весь распознанный текст
//     return response.data.results[0]?.recognition?.text || '';
//   }

//   private parseTTNText(recognizedText: string): TTNRecognitionResult {
//     // Парсим номер ТТН (ищем паттерны типа "ТТН №", "Накладная №" и т.д.)
//     const invoiceNumber = this.extractInvoiceNumber(recognizedText);
    
//     // Парсим дату (разные форматы дат)
//     const invoiceDate = this.extractDate(recognizedText);
    
//     // Парсим поставщика
//     const supplier = this.extractSupplier(recognizedText);
    
//     // Парсим позиции материалов
//     const items = this.extractMaterials(recognizedText);

//     return {
//       invoiceNumber,
//       invoiceDate, 
//       supplier,
//       items,
//       rawText: recognizedText,
//       confidence: 0.85 // Можно вычислять на основе качества распознавания
//     };
//   }

//   private extractInvoiceNumber(text: string): string {
//     const patterns = [
//       /ТТН[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
//       /Накладная[:\s]*№?[\s]*([A-ZА-Я0-9-]+)/i,
//       /№[\s]*([A-ZА-Я0-9-]{5,})/i
//     ];
    
//     for (const pattern of patterns) {
//       const match = text.match(pattern);
//       if (match) return match[1].trim();
//     }
    
//     return 'НЕ РАСПОЗНАНО';
//   }

//   private extractDate(text: string): Date {
//     const datePatterns = [
//       /(\d{2}\.\d{2}\.\d{4})/,
//       /(\d{4}-\d{2}-\d{2})/,
//       /(\d{1,2}\s+[а-я]+\s+\d{4})/i
//     ];
    
//     for (const pattern of datePatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         try {
//           return new Date(match[1]);
//         } catch {
//           continue;
//         }
//       }
//     }
    
//     return new Date(); // Дата по умолчанию - сегодня
//   }

//   private extractSupplier(text: string): string {
//     // Ищем ключевые слова перед названием поставщика
//     const supplierPatterns = [
//       /Поставщик[:\s]*([^\n]+)/i,
//       /Грузоотправитель[:\s]*([^\n]+)/i,
//       /Отправитель[:\s]*([^\n]+)/i
//     ];
    
//     for (const pattern of supplierPatterns) {
//       const match = text.match(pattern);
//       if (match) return match[1].trim();
//     }
    
//     return 'НЕ РАСПОЗНАНО';
//   }

//   private extractMaterials(text: string): Array<{
//     materialName: string;
//     quantity: number;
//     unit: string;
//   }> {
//     const items = [];
    
//     // Ищем таблицу с материалами (паттерны для позиций)
//     const lines = text.split('\n');
//     let inMaterialsSection = false;
    
//     for (const line of lines) {
//       // Определяем начало секции материалов
//       if (line.match(/Наименование|Материал|Товар/i)) {
//         inMaterialsSection = true;
//         continue;
//       }
      
//       if (inMaterialsSection && line.trim()) {
//         // Парсим строку материала (упрощенный вариант)
//         const materialMatch = line.match(/([А-Яа-я\s]+)\s+(\d+[,.]?\d*)\s*([А-Яа-я]+)/);
//         if (materialMatch) {
//           items.push({
//             materialName: materialMatch[1].trim(),
//             quantity: parseFloat(materialMatch[2].replace(',', '.')),
//             unit: materialMatch[3].trim()
//           });
//         }
//       }
//     }
    
//     return items;
//   }

//   private validateTTNData(data: TTNRecognitionResult): void {
//     if (!data.invoiceNumber || data.invoiceNumber === 'НЕ РАСПОЗНАНО') {
//       throw new Error('Не удалось распознать номер ТТН');
//     }
    
//     if (data.items.length === 0) {
//       throw new Error('Не удалось распознать позиции материалов в ТТН');
//     }
//   }
// }