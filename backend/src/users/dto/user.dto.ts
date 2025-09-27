import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'ID пользователя'
  })
  @IsNotEmpty()
  id: number; // Меняем string на number для consistency
}