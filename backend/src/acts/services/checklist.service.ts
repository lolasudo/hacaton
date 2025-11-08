import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistEntity, ChecklistType } from '../entities/checklist.entity';
import { ChecklistItemEntity } from '../entities/checklist-item.entity';
import { CreateChecklistDto } from '../dto/create-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private readonly checklistRepository: Repository<ChecklistEntity>,
  ) {}

  async findAll(): Promise<ChecklistEntity[]> {
    return this.checklistRepository.find({
      relations: ['object', 'items', 'createdBy', 'act']
    });
  }

  async findById(id: number): Promise<ChecklistEntity> {
    const checklist = await this.checklistRepository.findOne({
      where: { id },
      relations: ['object', 'items', 'createdBy', 'act']
    });

    if (!checklist) {
      throw new NotFoundException(`Checklist with ID ${id} not found`);
    }

    return checklist;
  }

  async findByObjectId(objectId: number): Promise<ChecklistEntity[]> {
    return this.checklistRepository.find({
      where: { object: { id: objectId } },
      relations: ['items', 'createdBy']
    });
  }

  async create(createChecklistDto: CreateChecklistDto): Promise<ChecklistEntity> {
    const { items, ...checklistData } = createChecklistDto;
    
    const checklist = this.checklistRepository.create(checklistData);
    
    // Создаем items
    if (items && items.length > 0) {
      checklist.items = items.map((item, index) => {
        const checklistItem = new ChecklistItemEntity();
        checklistItem.description = item.description;
        checklistItem.isCompleted = item.isCompleted || false;
        checklistItem.sortOrder = index;
        return checklistItem;
      });
    }

    return this.checklistRepository.save(checklist);
  }

  async updateItemStatus(checklistId: number, itemId: number, isCompleted: boolean): Promise<ChecklistEntity> {
    const checklist = await this.findById(checklistId);
    
    const item = checklist.items.find(i => i.id === itemId);
    if (!item) {
      throw new NotFoundException(`Checklist item with ID ${itemId} not found`);
    }

    item.isCompleted = isCompleted;
    await this.checklistRepository.save(checklist);

    return checklist;
  }

  async getOpeningChecklist(objectId: number): Promise<ChecklistEntity | null> {
    return this.checklistRepository.findOne({
      where: { 
        object: { id: objectId },
        type: ChecklistType.OBJECT_OPENING // ИСПРАВЛЕНО: используем enum вместо строки
      },
      relations: ['items', 'createdBy']
    });
  }

  async generateChecklistPdf(checklistId: number): Promise<Buffer> {
    const checklist = await this.findById(checklistId);
    // Здесь будет логика генерации PDF для чек-листа
    return Buffer.from(`PDF for Checklist ${checklist.name}`);
  }
}