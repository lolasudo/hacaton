import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignDefectDto {
  @ApiProperty({ description: 'ID пользователя, на которого назначается замечание' })
  @IsNotEmpty()
  @IsNumber()
  assignedToId: number;
}