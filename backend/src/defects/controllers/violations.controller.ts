// src/defects/controllers/violations.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ViolationsService } from '../services/violations.service';
import { CreateViolationDto } from '../dto/create-violation.dto';

@ApiTags('violations')
@Controller('violations')
export class ViolationsController {
  constructor(private readonly violationsService: ViolationsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нарушение' })
  create(@Body() createViolationDto: CreateViolationDto) {
    return this.violationsService.create(createViolationDto);
  }

  @Get('object/:objectId')
  @ApiOperation({ summary: 'Получить нарушения по объекту' })
  findAllForObject(@Param('objectId') objectId: string) {
    return this.violationsService.findAllForObject(+objectId);
  }

  // 🔥 ДОБАВЬ ЭТОТ МЕТОД
  @Get(':id')
  @ApiOperation({ summary: 'Получить нарушение по ID' })
  findOne(@Param('id') id: string) {
    return this.violationsService.findOne(+id);
  }
}