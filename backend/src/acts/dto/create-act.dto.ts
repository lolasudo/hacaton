import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ActType } from '../entities/act.entity';

export class CreateActDto {
  @IsNotEmpty()
  @IsString()
  actNumber: string;

  @IsNotEmpty()
  @IsNumber()
  objectId: number;

  @IsEnum(ActType)
  type: ActType;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  createdById?: number;
}