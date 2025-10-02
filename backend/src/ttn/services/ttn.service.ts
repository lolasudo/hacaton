// src/ttn/services/ttn.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TTN } from '../domain/ttn';
import { TTNRelationalRepository } from '../infrastructure/persistence/relational/repositories/ttn.repository';
import { TTNFileService } from '../infrastructure/file-storage/ttn-file.service';
import { CreateTTNDto } from '../dto/create-ttn.dto';
import { UpdateTTNDto } from '../dto/update-ttn.dto';
import { UpdateTTNStatusDto } from '../dto/update-ttn-status.dto';
import { NullableType } from '../../utils/types/nullable.type';
import { TTNStatus } from '../domain/ttn-status.enum';
import { TTNItem } from '../domain/ttn-item';

// Интерфейс для OCR результата (совместимый с YandexVisionOCRService)
interface IOCRResult {
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

interface IOCRService {
  recognizeTTN(imageBuffer: Buffer): Promise<IOCRResult>;
}

@Injectable()
export class TTNService {
  constructor(
    @Inject('TTNRepository')
    private readonly ttnRepository: TTNRelationalRepository,
    @Inject('OCRService')
    private readonly ocrService: IOCRService,
    private readonly ttnFileService: TTNFileService,
  ) {}

  // 🔴 ДОБАВЛЯЕМ НОВЫЙ МЕТОД processTTNWithOCR
  async processTTNWithOCR(
    file: Express.Multer.File,
    createTTNDto: CreateTTNDto,
    contractorId: number,
    recognitionResult: IOCRResult,
  ): Promise<TTN> {
    try {
      const photoPath = await this.ttnFileService.saveTTNPhoto(file);
      
      console.log('🔍 Processing TTN with OCR result:', {
        invoiceNumber: recognitionResult.invoiceNumber,
        supplier: recognitionResult.supplier,
        itemsCount: recognitionResult.items?.length || 0,
      });

      const ttn = new TTN();
      ttn.invoiceNumber = recognitionResult.invoiceNumber || 'НЕ РАСПОЗНАНО';
      ttn.invoiceDate = recognitionResult.invoiceDate || new Date();
      ttn.supplier = recognitionResult.supplier || 'НЕ РАСПОЗНАНО';
      ttn.carrier = recognitionResult.carrier;
      ttn.vehicleNumber = recognitionResult.vehicleNumber;
      ttn.driverName = recognitionResult.driverName;
      
      // Преобразуем строку в число
      ttn.constructionObjectId = parseInt(createTTNDto.constructionObjectId, 10);
      
      ttn.contractorId = contractorId;
      ttn.status = TTNStatus.UPLOADED;
      ttn.photoPath = photoPath;
      ttn.recognizedData = recognitionResult;
      ttn.createdAt = new Date();
      ttn.updatedAt = new Date();

      // Создаем TTNItem
      ttn.items = (recognitionResult.items || []).map((item, index) => {
        const ttnItem = new TTNItem();
        ttnItem.materialName = item.materialName || 'Неизвестный материал';
        ttnItem.quantity = item.quantity || 0;
        ttnItem.unit = item.unit || 'шт.';
        ttnItem.price = item.price;
        ttnItem.totalAmount = item.totalAmount;
        ttnItem.createdAt = new Date();
        ttnItem.updatedAt = new Date();
        return ttnItem;
      });

      console.log('🔍 Creating TTN with items:', ttn.items.length);
      
      const savedTTN = await this.ttnRepository.create(ttn);
      console.log('✅ TTN successfully created with ID:', savedTTN.id);
      
      return savedTTN;

    } catch (error) {
      console.error('❌ Error in processTTNWithOCR:', error);
      throw error;
    }
  }

  // 🔴 ОБНОВЛЯЕМ СУЩЕСТВУЮЩИЙ МЕТОД processTTN
  async processTTN(
    file: Express.Multer.File,
    createTTNDto: CreateTTNDto,
    contractorId: number,
  ): Promise<TTN> {
    try {
      const photoPath = await this.ttnFileService.saveTTNPhoto(file);
      
      console.log('🔍 Starting OCR recognition in processTTN...');
      
      const recognitionResult = await this.ocrService.recognizeTTN(file.buffer);

      console.log('🔍 OCR Recognition Result:', {
        invoiceNumber: recognitionResult.invoiceNumber,
        supplier: recognitionResult.supplier,
        itemsCount: recognitionResult.items?.length || 0,
      });

      const ttn = new TTN();
      ttn.invoiceNumber = recognitionResult.invoiceNumber || 'НЕ РАСПОЗНАНО';
      ttn.invoiceDate = recognitionResult.invoiceDate || new Date();
      ttn.supplier = recognitionResult.supplier || 'НЕ РАСПОЗНАНО';
      ttn.carrier = recognitionResult.carrier;
      ttn.vehicleNumber = recognitionResult.vehicleNumber;
      ttn.driverName = recognitionResult.driverName;
      
      ttn.constructionObjectId = parseInt(createTTNDto.constructionObjectId, 10);
      ttn.contractorId = contractorId;
      ttn.status = TTNStatus.UPLOADED;
      ttn.photoPath = photoPath;
      ttn.recognizedData = recognitionResult;
      ttn.createdAt = new Date();
      ttn.updatedAt = new Date();

      ttn.items = (recognitionResult.items || []).map((item, index) => {
        const ttnItem = new TTNItem();
        ttnItem.materialName = item.materialName || 'Неизвестный материал';
        ttnItem.quantity = item.quantity || 0;
        ttnItem.unit = item.unit || 'шт.';
        ttnItem.price = item.price;
        ttnItem.totalAmount = item.totalAmount;
        ttnItem.createdAt = new Date();
        ttnItem.updatedAt = new Date();
        return ttnItem;
      });

      console.log('🔍 Creating TTN with items:', ttn.items.length);
      
      const savedTTN = await this.ttnRepository.create(ttn);
      console.log('✅ TTN successfully created with ID:', savedTTN.id);
      
      return savedTTN;

    } catch (error) {
      console.error('❌ Error in processTTN:', error);
      throw error;
    }
  }

  // Найти ТТН по ID
  async findById(id: number): Promise<NullableType<TTN>> {
    return this.ttnRepository.findById(id);
  }

  // Найти ТТН по объекту строительства
  async findByConstructionObjectId(constructionObjectId: number): Promise<TTN[]> {
    return this.ttnRepository.findByConstructionObjectId(constructionObjectId);
  }

  // Найти ТТН по подрядчику
  async findByContractorId(contractorId: number): Promise<TTN[]> {
    return this.ttnRepository.findByContractorId(contractorId);
  }

  // Получить все ТТН с фильтрацией
  async findAll(filters: {
    constructionObjectId?: number;
    contractorId?: number;
    status?: TTNStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: TTN[]; total: number }> {
    return this.ttnRepository.findAll(filters);
  }

  // Обновить данные ТТН
  async update(id: number, updateTTNDto: UpdateTTNDto): Promise<TTN> {
    const ttn = await this.ttnRepository.findById(id);
    if (!ttn) {
      throw new NotFoundException(`TTN with id ${id} not found`);
    }

    const updateData: Partial<TTN> = {
      ...updateTTNDto,
      updatedAt: new Date(),
    };

    return this.ttnRepository.update(id, updateData);
  }

  // Обновить статус ТТН
  async updateStatus(id: number, updateStatusDto: UpdateTTNStatusDto, userId: number): Promise<TTN> {
    const ttn = await this.ttnRepository.findById(id);
    if (!ttn) {
      throw new NotFoundException(`TTN with id ${id} not found`);
    }

    this.validateStatusTransition(ttn.status, updateStatusDto.status);

    const updateData: Partial<TTN> = {
      status: updateStatusDto.status,
      updatedAt: new Date(),
    };

    const updatedTTN = await this.ttnRepository.update(id, updateData);
    return updatedTTN;
  }

  // Найти ТТН по номеру накладной
  async findByInvoiceNumber(invoiceNumber: string): Promise<TTN | null> {
    return this.ttnRepository.findByInvoiceNumber(invoiceNumber);
  }

  // Удалить ТТН
  async delete(id: number): Promise<void> {
    const ttn = await this.ttnRepository.findById(id);
    if (!ttn) {
      throw new NotFoundException(`TTN with id ${id} not found`);
    }
    await this.ttnRepository.delete(id);
  }

  // Верифицировать ТТН
  async verifyTTN(id: number, userId: number): Promise<TTN> {
    return this.updateStatus(id, { 
      status: TTNStatus.VERIFIED, 
      comment: 'ТТН проверена и верифицирована' 
    }, userId);
  }

  // Отклонить ТТН
  async rejectTTN(id: number, comment: string, userId: number): Promise<TTN> {
    return this.updateStatus(id, { 
      status: TTNStatus.REJECTED, 
      comment: comment || 'ТТН отклонена' 
    }, userId);
  }

  // Запросить лабораторные испытания
  async requestLabTest(id: number, userId: number): Promise<TTN> {
    const ttn = await this.ttnRepository.findById(id);
    if (!ttn) {
      throw new NotFoundException(`TTN with id ${id} not found`);
    }
    return this.updateStatus(id, { 
      status: TTNStatus.NEEDS_REVIEW, 
      comment: 'Требуются лабораторные испытания' 
    }, userId);
  }

  // Приватные методы
  private validateStatusTransition(oldStatus: TTNStatus, newStatus: TTNStatus): void {
    const allowedTransitions: Record<TTNStatus, TTNStatus[]> = {
      [TTNStatus.UPLOADED]: [TTNStatus.RECOGNIZING, TTNStatus.NEEDS_REVIEW, TTNStatus.REJECTED],
      [TTNStatus.RECOGNIZING]: [TTNStatus.NEEDS_REVIEW, TTNStatus.VERIFIED, TTNStatus.REJECTED],
      [TTNStatus.NEEDS_REVIEW]: [TTNStatus.VERIFIED, TTNStatus.REJECTED],
      [TTNStatus.VERIFIED]: [TTNStatus.APPROVED, TTNStatus.REJECTED],
      [TTNStatus.APPROVED]: [TTNStatus.PROCESSED],
      [TTNStatus.REJECTED]: [TTNStatus.UPLOADED],
      [TTNStatus.PROCESSED]: [],
    };

    if (!allowedTransitions[oldStatus]?.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
    }
  }
}