// src/modules/reporting/controllers/reporting.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UsePipes, 
  ValidationPipe,
  Req,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { ReportingService } from '../services/reporting.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { KPIQueryDto } from '../dto/kpi-query.dto';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  // Отчеты
  @Post('reports')
  @UsePipes(new ValidationPipe())
  async createReport(@Body() createReportDto: CreateReportDto, @Req() req) {
    // Заглушка для userId пока не настроена аутентификация
    const userId = req.user?.id || 'system-user';
    return await this.reportingService.createReport(createReportDto, userId);
  }

  @Get('reports')
  async getUserReports(@Req() req) {
    const userId = req.user?.id || 'system-user';
    return await this.reportingService.getUserReports(userId);
  }

  @Get('reports/:id')
  async getReport(@Param('id') id: string) {
    return await this.reportingService.getReport(id);
  }

  @Post('reports/:id/generate')
  async generateReport(@Param('id') id: string) {
    return await this.reportingService.generateReport(id);
  }

  // Дашборды
  @Post('dashboards')
  async createDashboard(
    @Body('name') name: string,
    @Body('description') description: string,
    @Req() req
  ) {
    const userId = req.user?.id || 'system-user';
    return await this.reportingService.createDashboard(name, description, userId);
  }

  @Get('dashboards/:id')
  async getDashboard(@Param('id') id: string) {
    return await this.reportingService.getDashboard(id);
  }

  // KPI метрики
  @Get('kpi')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getKPIMetrics(@Query() query: KPIQueryDto) {
    return await this.reportingService.getKPIMetrics(query);
  }

  @Post('kpi')
  async recordKPIMetric(
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('value') value: number,
    @Body('target') target: number,
    @Body('frequency') frequency: string,
    @Body('objectId') objectId?: string
  ) {
    return await this.reportingService.recordKPIMetric(
      name, category, value, target, frequency, objectId
    );
  }

  // API для дашбордов
  @Get('construction-readiness')
  async getConstructionReadiness(@Query('objectId') objectId?: string) {
    return await this.reportingService.getConstructionReadiness(objectId);
  }

  @Get('defects-statistics')
  async getDefectsStatistics(@Query('objectId') objectId?: string) {
    return await this.reportingService.getDefectsStatistics(objectId);
  }

  @Get('performance-metrics')
  async getPerformanceMetrics(@Query('objectId') objectId?: string) {
    return await this.reportingService.getPerformanceMetrics(objectId);
  }

  @Get('timeline-data')
  async getTimelineData(
    @Query('objectId') objectId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    if (!objectId) {
      throw new BadRequestException('objectId is required');
    }
    return await this.reportingService.getTimelineData(objectId, startDate, endDate);
  }
}