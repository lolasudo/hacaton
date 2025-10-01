import { ApiProperty } from '@nestjs/swagger';
import { TTNStatus } from '../domain/ttn-status.enum';

export class TTNItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  materialName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  matchedMaterialId?: number;
}

export class TTNStatusHistoryResponseDto {
  @ApiProperty({ enum: TTNStatus })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  comment?: string;
}

export class TTNResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  invoiceDate: Date;

  @ApiProperty()
  supplier: string;

  @ApiProperty({ enum: TTNStatus })
  status: string;

  @ApiProperty({ type: [TTNItemResponseDto] })
  items: TTNItemResponseDto[];

  @ApiProperty({ type: [TTNStatusHistoryResponseDto] })
  statusHistory: TTNStatusHistoryResponseDto[];

  @ApiProperty()
  createdAt: Date;
}