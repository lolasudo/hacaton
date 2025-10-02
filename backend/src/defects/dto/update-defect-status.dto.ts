// src/defects/dto/update-defect-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { DefectStatus } from '../entities/defect.entity';

export class UpdateDefectStatusDto {
  @ApiProperty({ 
    description: 'Новый статус замечания', 
    enum: DefectStatus 
  })
  @IsNotEmpty()
  @IsEnum(DefectStatus)
  status: DefectStatus;

  @ApiProperty({ 
    description: 'Детали устранения (обязательно при статусе FIXED)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  resolutionDetails?: string;
}