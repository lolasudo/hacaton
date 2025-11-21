import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ActivateObjectDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  inspectorId: number; 
}