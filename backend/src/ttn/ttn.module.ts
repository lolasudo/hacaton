// src/ttn/ttn.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TTNController } from './controllers/ttn.controller';
import { TTNService } from './services/ttn.service';
import { TTNEntity } from './infrastructure/persistence/relational/entities/ttn.entity';
import { TTNRelationalRepository } from './infrastructure/persistence/relational/repositories/ttn.repository';
import { LocalOCRService } from './infrastructure/ocr/local-ocr.service';
import { YandexVisionOCRService } from './infrastructure/ocr/yandex-ocr.service'; // ← ДОБАВИТЬ
import { TTNFileService } from './infrastructure/file-storage/ttn-file.service';

@Module({
  imports: [
    HttpModule, 
    TypeOrmModule.forFeature([TTNEntity]),
    ConfigModule,
  ],
  controllers: [TTNController],
  providers: [
    TTNService,
    {
      provide: 'OCRService',
      useClass: YandexVisionOCRService, 
    },
    TTNFileService,
    {
      provide: 'TTNRepository',
      useClass: TTNRelationalRepository,
    },
    YandexVisionOCRService,
  ],
  exports: [TTNService],
})
export class TTNModule {}