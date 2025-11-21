import { PartialType } from '@nestjs/mapped-types';
import { CreateActDto } from './create-act.dto';

export class UpdateActDto extends PartialType(CreateActDto) {}