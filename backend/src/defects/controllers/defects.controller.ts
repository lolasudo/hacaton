// src/defects/controllers/defects.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DefectsService } from '../services/defects.service';
import { CreateDefectDto } from '../dto/create-defect.dto';
import { UpdateDefectStatusDto } from '../dto/update-defect-status.dto';
import { AssignDefectDto } from '../dto/assign-defect.dto';
import { DefectPriority } from '../entities/defect.entity';

@ApiTags('defects')
@Controller('defects')
@UsePipes(new ValidationPipe({ transform: true }))
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать замечание' })
  @ApiResponse({ status: 201, description: 'Замечание успешно создано' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createDefectDto: CreateDefectDto) {
    return this.defectsService.create(createDefectDto, 1);
  }

  @Get('object/:objectId')
  @ApiOperation({ summary: 'Получить замечания по объекту' })
  @ApiResponse({ status: 200, description: 'Список замечаний' })
  findAllForObject(@Param('objectId') objectId: string) {
    return this.defectsService.findAllForObject(+objectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить замечание по ID' })
  @ApiResponse({ status: 200, description: 'Данные замечания' })
  @ApiResponse({ status: 404, description: 'Замечание не найдено' })
  findOne(@Param('id') id: string) {
    return this.defectsService.findOne(+id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус замечания' })
  @ApiResponse({ status: 200, description: 'Статус обновлен' })
  @ApiResponse({ status: 404, description: 'Замечание не найдено' })
  updateStatus(
    @Param('id') id: string, 
    @Body() updateDefectStatusDto: UpdateDefectStatusDto
  ) {
    return this.defectsService.updateStatus(+id, updateDefectStatusDto);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Назначить замечание на исполнителя' })
  @ApiResponse({ status: 200, description: 'Замечание назначено' })
  @ApiResponse({ status: 404, description: 'Замечание не найдено' })
  assign(
    @Param('id') id: string, 
    @Body() assignDefectDto: AssignDefectDto
  ) {
    return this.defectsService.assign(+id, assignDefectDto);
  }

  @Get('object/:objectId/stats')
  @ApiOperation({ summary: 'Получить статистику по замечаниям объекта' })
  @ApiResponse({ status: 200, description: 'Статистика замечаний' })
  getDefectStats(@Param('objectId') objectId: string) {
    return this.defectsService.getDefectStats(+objectId);
  }

  @Get('reports/overdue')
  @ApiOperation({ summary: 'Получить просроченные замечания' })
  @ApiResponse({ status: 200, description: 'Список просроченных замечаний' })
  getOverdueDefects() {
    return this.defectsService.getOverdueDefects();
  }

  @Get('priority/:priority')
  @ApiOperation({ summary: 'Получить замечания по приоритету' })
  @ApiQuery({ name: 'priority', enum: DefectPriority })
  @ApiResponse({ status: 200, description: 'Список замечаний по приоритету' })
  getDefectsByPriority(@Param('priority') priority: DefectPriority) {
    return this.defectsService.getDefectsByPriority(priority);
  }

  @Get('object/:objectId/search')
  @ApiOperation({ summary: 'Поиск замечаний по объекту' })
  @ApiQuery({ name: 'q', description: 'Поисковый запрос' })
  @ApiResponse({ status: 200, description: 'Результаты поиска' })
  searchDefects(
    @Param('objectId') objectId: string,
    @Query('q') searchTerm: string
  ) {
    return this.defectsService.searchDefects(+objectId, searchTerm);
  }
}