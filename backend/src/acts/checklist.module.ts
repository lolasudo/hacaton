import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistController } from './controllers/checklist.controller';
import { ChecklistService } from './services/checklist.service';
import { PdfGenerationService } from './services/pdf-generation.service';
import { ChecklistEntity } from './entities/checklist.entity';
import { ChecklistItemEntity } from './entities/checklist-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChecklistEntity,
      ChecklistItemEntity,
    ])
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService, PdfGenerationService],
  exports: [ChecklistService]
})
export class ChecklistsModule {}