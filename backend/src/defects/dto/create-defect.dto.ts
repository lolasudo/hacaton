// src/defects/dto/create-defect.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsDate, 
  IsBoolean, 
  IsOptional, 
  IsArray,
  IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { DefectPriority } from '../entities/defect.entity';

export class CreateDefectDto {
  @ApiProperty({ description: 'Название замечания' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Подробное описание' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID объекта' })
  @IsNumber()
  objectId: number;

  @ApiProperty({ description: 'Срок устранения' })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({ 
    description: 'Приоритет', 
    enum: DefectPriority,
    default: DefectPriority.MEDIUM
  })
  @IsEnum(DefectPriority)
  priority: DefectPriority;

  @ApiProperty({ description: 'Категория' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Широта' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Долгота' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'Требуется верификация', required: false })
  @IsOptional()
  @IsBoolean()
  requiresVerification?: boolean;

  @ApiProperty({ description: 'Фотографии', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @ApiProperty({ description: 'ID назначенного исполнителя', required: false })
  @IsOptional()
  @IsNumber()
  assignedToId?: number;
}