// src/work-schedules/work-schedules.module.ts
import { Module } from '@nestjs/common';
import { WorkSchedulesService } from './work-schedules.service';
import { WorkSchedulesController } from './work-schedules.controller';

@Module({
  controllers: [WorkSchedulesController],
  providers: [WorkSchedulesService],
  exports: [WorkSchedulesService],
})
export class WorkSchedulesModule {}