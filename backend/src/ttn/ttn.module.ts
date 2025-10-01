import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // ← ДОБАВИТЬ
import { TTNController } from './controllers/ttn.controller';
import { TTNService } from './services/ttn.service';
import { TTNEntity } from './infrastructure/persistence/relational/entities/ttn.entity';
import { TTNRelationalRepository } from './infrastructure/persistence/relational/repositories/ttn.repository';
import { LocalOCRService } from './infrastructure/ocr/local-ocr.service';
import { TTNFileService } from './infrastructure/file-storage/ttn-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TTNEntity]),
    ConfigModule, // ← ДОБАВИТЬ для ConfigService
  ],
  controllers: [TTNController],
  providers: [
    TTNService,
    {
      provide: 'OCRService',
      useClass: LocalOCRService,
    },
    TTNFileService,
    {
      provide: 'TTNRepository',
      useClass: TTNRelationalRepository,
    },
  ],
  exports: [TTNService],
})
export class TTNModule {}