import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ivan.petrov@example.com' })
  email: string;

  @ApiProperty({ example: 'Иван' })
  firstName: string;

  @ApiProperty({ example: 'Петров' })
  lastName: string;

  @ApiProperty({ example: '+7 (999) 123-45-67' })
  phone: string;

  // ✅ Правильно - только id роли
  @ApiProperty({ example: { id: 2 } })
  role: { id: number };

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}