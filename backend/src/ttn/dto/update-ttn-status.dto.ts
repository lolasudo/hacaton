// src/ttn/dto/update-ttn-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TTNStatus } from '../domain/ttn-status.enum';

export class UpdateTTNStatusDto { // ← ИЗМЕНИТЬ НАЗВАНИЕ КЛАССА
  @ApiProperty({ enum: TTNStatus, example: TTNStatus.VERIFIED })
  @IsNotEmpty()
  @IsEnum(TTNStatus)
  status: TTNStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}