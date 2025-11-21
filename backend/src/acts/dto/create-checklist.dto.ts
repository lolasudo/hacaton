import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChecklistType } from '../entities/checklist.entity';

export class ChecklistItemDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  isCompleted?: boolean = false;
}

export class CreateChecklistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(ChecklistType)
  type: ChecklistType;

  @IsNotEmpty()
  @IsNumber()
  objectId: number;

  @IsOptional()
  @IsNumber()
  actId?: number;

  @IsNotEmpty()
  @IsNumber()
  createdById: number;

  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}