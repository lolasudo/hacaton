import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActController } from './controllers/act.controller';
import { ActService } from './services/act.service';
import { PdfGenerationService } from './services/pdf-generation.service';
import { ActEntity } from './entities/act.entity';
import { ActAttachmentEntity } from './entities/act-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActEntity,
      ActAttachmentEntity,
    ])
  ],
  controllers: [ActController],
  providers: [ActService, PdfGenerationService],
  exports: [ActService]
})
export class ActsModule {}