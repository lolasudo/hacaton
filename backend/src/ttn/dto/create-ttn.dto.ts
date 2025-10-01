import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateTTNDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumberString()
  constructionObjectId: string;
}