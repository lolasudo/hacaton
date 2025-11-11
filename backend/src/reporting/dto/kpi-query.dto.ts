// src/modules/reporting/dto/kpi-query.dto.ts
import { IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class KPIQueryDto {
  @IsEnum(['efficiency', 'quality', 'timeliness', 'safety', 'cost'])
  @IsOptional()
  category?: string;

  @IsEnum(['daily', 'weekly', 'monthly', 'quarterly'])
  @IsOptional()
  frequency?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsUUID()
  @IsOptional()
  objectId?: string;
}