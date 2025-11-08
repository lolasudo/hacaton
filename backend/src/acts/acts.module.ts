import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActController } from './controllers/act.controller';
import { ChecklistController } from './controllers/checklist.controller';
import { ActService } from './services/act.service';
import { ChecklistService } from './services/checklist.service';
import { PdfGenerationService } from './services/pdf-generation.service';
import { ActEntity } from './entities/act.entity';
import { ChecklistEntity } from './entities/checklist.entity';
import { ChecklistItemEntity } from './entities/checklist-item.entity';
import { ActAttachmentEntity } from './entities/act-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActEntity,
      ChecklistEntity, 
      ChecklistItemEntity,
      ActAttachmentEntity,
    ])
  ],
  controllers: [ActController, ChecklistController],
  providers: [ActService, ChecklistService, PdfGenerationService],
  exports: [ActService, ChecklistService]
})
export class ActsModule {}