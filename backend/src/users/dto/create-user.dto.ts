import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;
  socialId?: string | null;

  @ApiProperty({ example: 'Иван', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Петров', type: String })
  @IsNotEmpty()
  lastName: string | null;

  // ✅ ДОБАВЛЯЕМ ТОЛЬКО phone
  @ApiProperty({ example: '+7 (999) 123-45-67', type: String })
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string | null;

  // ❌ УБИРАЕМ roleId - используем существующее role
 

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}