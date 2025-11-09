import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  Res,
  Header 
} from '@nestjs/common';
import { Response } from 'express';
import { ChecklistService } from '../services/checklist.service';
import { CreateChecklistDto } from '../dto/create-checklist.dto';
import { ChecklistEntity } from '../entities/checklist.entity';

@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  async findAll(): Promise<ChecklistEntity[]> {
    return this.checklistService.findAll();
  }

  @Get('object/:objectId')
  async findByObjectId(@Param('objectId', ParseIntPipe) objectId: number): Promise<ChecklistEntity[]> {
    return this.checklistService.findByObjectId(objectId);
  }

  @Get('object/:objectId/opening')
  async getOpeningChecklist(@Param('objectId', ParseIntPipe) objectId: number): Promise<ChecklistEntity | null> {
    return this.checklistService.getOpeningChecklist(objectId);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ChecklistEntity> {
    return this.checklistService.findById(id);
  }

  @Post()
  async create(@Body() createChecklistDto: CreateChecklistDto): Promise<ChecklistEntity> {
    return this.checklistService.create(createChecklistDto);
  }

  @Put(':checklistId/items/:itemId')
  async updateItemStatus(
    @Param('checklistId', ParseIntPipe) checklistId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body('isCompleted') isCompleted: boolean
  ): Promise<ChecklistEntity> {
    return this.checklistService.updateItemStatus(checklistId, itemId, isCompleted);
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="checklist.pdf"')
  async generatePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const pdfBuffer = await this.checklistService.generateChecklistPdf(id);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Ошибка генерации PDF' });
    }
  }
}