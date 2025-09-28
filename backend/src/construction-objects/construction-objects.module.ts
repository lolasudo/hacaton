import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionObjectsService } from './services/construction-objects.service';
import { CustomerObjectsController } from './controllers/customer-objects.controller';
import { ContractorObjectsController } from './controllers/contractor-objects.controller';
import { InspectorObjectsController } from './controllers/inspector-objects.controller';
import { ConstructionObjectEntity } from './infrastructure/persistence/relational/entities/construction-object.entity';
import { ConstructionObjectRelationalRepository } from './infrastructure/persistence/relational/repositories/construction-object.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConstructionObjectEntity])],
  controllers: [
    CustomerObjectsController,
    ContractorObjectsController,
    InspectorObjectsController,
  ],
  providers: [
    ConstructionObjectsService,
    {
      provide: 'ConstructionObjectRepository',
      useClass: ConstructionObjectRelationalRepository,
    },
  ],
  exports: [ConstructionObjectsService],
})
export class ConstructionObjectsModule {}