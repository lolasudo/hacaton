import { IsString, IsNumber, IsArray, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkScheduleTaskDto {
  @ApiProperty({ description: 'Название задачи' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Дата начала' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'Дата окончания' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ description: 'Длительность в днях' })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Зависимости от других задач', default: [] })
  @IsArray()
  dependencies: number[]; // ✅ теперь обязательное поле

  @ApiProperty({ description: 'ID ответственного', required: false })
  @IsNumber()
  @IsOptional()
  assignedTo?: number;
}

export class CreateWorkScheduleDto {
  @ApiProperty({ description: 'ID объекта' })
  @IsNumber()
  objectId: number;

  @ApiProperty({ description: 'Название графика работ' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Список задач', type: [CreateWorkScheduleTaskDto] })
  @IsArray()
  tasks: CreateWorkScheduleTaskDto[];
}