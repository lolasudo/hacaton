// src/defects/dto/create-comment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  defectId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  violationId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  createdById?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string;
}