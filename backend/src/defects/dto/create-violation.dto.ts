import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateViolationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  objectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classificationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classificationDescription: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assignedToId?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  requiresLabSamples?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  labSampleDetails?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  photos?: string[];
}