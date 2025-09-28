import { PartialType } from '@nestjs/swagger';
import { CreateObjectDto } from './create-object.dto';

export class UpdateObjectDto extends PartialType(CreateObjectDto) {}