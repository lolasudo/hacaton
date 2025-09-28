import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateObjectDto {
  @ApiProperty({ example: 'ЖК "Солнечный"' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, 1' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '55.7558,37.6176;55.7601,37.6176;55.7601,37.6250' })
  @IsNotEmpty()
  @IsString()
  polygon: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  contractorId: number; // ID прораба

  @ApiProperty({ example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2024-12-31' })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}