// src/modules/reporting/reporting.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportingController } from './controllers/reporting.controller';
import { ReportingService } from './services/reporting.service';
import { Report } from './entities/report.entity';
import { Dashboard } from './entities/dashboard.entity';
import { KPIMetric } from './entities/kpi.entity';

// Правильные импорты модулей
import { ConstructionObjectsModule } from '../construction-objects/construction-objects.module';
import { WorkSchedulesModule } from '../work-schedules/work-schedules.module';
import { DefectsModule } from '../defects/defects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Dashboard, KPIMetric]),
    ConstructionObjectsModule,
    WorkSchedulesModule,
    DefectsModule,
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService]
})
export class ReportingModule {}