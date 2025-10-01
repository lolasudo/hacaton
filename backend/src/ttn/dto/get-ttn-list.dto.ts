// src/ttn/dto/get-ttn-list.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { TTNStatus } from '../domain/ttn-status.enum';

export class GetTTNListDto {
  @ApiProperty({ required: false, description: 'ID объекта строительства' })
  @IsOptional()
  @IsNumber()
  constructionObjectId?: number;

  @ApiProperty({ required: false, description: 'ID подрядчика' })
  @IsOptional()
  @IsNumber()
  contractorId?: number;

  @ApiProperty({ enum: TTNStatus, required: false, description: 'Статус ТТН' })
  @IsOptional()
  @IsEnum(TTNStatus)
  status?: TTNStatus;

  @ApiProperty({ required: false, description: 'Дата с (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ required: false, description: 'Дата по (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}