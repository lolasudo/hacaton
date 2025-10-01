// src/ttn/dto/update-ttn.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateTTNDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  invoiceDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}