// src/modules/reporting/dto/create-report.dto.ts
import { IsString, IsEnum, IsOptional, IsObject, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['readiness', 'defects', 'violations', 'performance', 'custom'])
  type: string;

  @IsObject()
  @IsOptional()
  filters?: any;

  @IsUUID()
  @IsOptional()
  objectId?: string;
}