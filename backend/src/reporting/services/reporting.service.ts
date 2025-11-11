// src/modules/reporting/services/reporting.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report } from '../entities/report.entity';
import { Dashboard } from '../entities/dashboard.entity';
import { KPIMetric } from '../entities/kpi.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { KPIQueryDto } from '../dto/kpi-query.dto';
import { 
  ConstructionReadinessData, 
  DefectsStatistics, 
  KPIResponse
} from '../interfaces/reporting.interface';

import { ConstructionObjectsService } from '../../construction-objects/services/construction-objects.service';
import { WorkSchedulesService } from '../../work-schedules/work-schedules.service';
import { DefectsService } from '../../defects/services/defects.service';

interface ConstructionObject {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  progress?: number;
}

interface WorkSchedule {
  id: number;
  objectId: number;
  tasks: Task[];
}

interface Defect {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate?: Date;
  createdAt: Date;
}

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
    @InjectRepository(KPIMetric)
    private readonly kpiRepository: Repository<KPIMetric>,
    private readonly constructionObjectsService: ConstructionObjectsService,
    private readonly workSchedulesService: WorkSchedulesService,
    private readonly defectsService: DefectsService,
  ) {}

  async createReport(createReportDto: CreateReportDto, userId: string): Promise<Report> {
    try {
      const reportData = await this.generateReportData(createReportDto.type, createReportDto.filters);
      
      const report = this.reportRepository.create({
        ...createReportDto,
        createdBy: userId,
        status: 'draft',
        data: reportData
      });

      return await this.reportRepository.save(report);
    } catch (error) {
      throw new BadRequestException(`Failed to create report: ${error.message}`);
    }
  }

  async getReport(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ 
      where: { id }
    });
    
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    
    return report;
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' }
    });
  }

  async generateReport(reportId: string): Promise<Report> {
    const report = await this.getReport(reportId);
    
    report.data = await this.generateReportData(report.type, report.filters);
    report.status = 'generated';
    report.generatedAt = new Date();
    
    return await this.reportRepository.save(report);
  }

  async createDashboard(name: string, description: string, userId: string): Promise<Dashboard> {
    const dashboard = this.dashboardRepository.create({
      name,
      description,
      createdBy: userId,
      layout: { grid: [] },
      widgets: []
    });

    return await this.dashboardRepository.save(dashboard);
  }

  async getDashboard(id: string): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({ 
      where: { id }
    });
    
    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }
    
    return dashboard;
  }

  async getKPIMetrics(query: KPIQueryDto): Promise<KPIResponse[]> {
    const where: any = {};
    
    if (query.category) {
      where.category = query.category;
    }
    
    if (query.frequency) {
      where.frequency = query.frequency;
    }
    
    if (query.objectId) {
      const objectId = parseInt(query.objectId);
      if (isNaN(objectId)) {
        throw new BadRequestException('Invalid object ID format');
      }
      where.objectId = objectId;
    }
    
    if (query.startDate && query.endDate) {
      where.measurementDate = Between(new Date(query.startDate), new Date(query.endDate));
    }

    const metrics = await this.kpiRepository.find({
      where,
      order: { measurementDate: 'DESC' }
    });

    return metrics.map(metric => this.formatKPIResponse(metric));
  }

  async recordKPIMetric(
    name: string, 
    category: string, 
    value: number, 
    target: number, 
    frequency: string,
    objectId?: string
  ): Promise<KPIMetric> {
    let objectIdNum: number | undefined = undefined;

    // Validate and convert objectId
    if (objectId) {
      objectIdNum = parseInt(objectId);
      if (isNaN(objectIdNum)) {
        throw new BadRequestException('Invalid object ID format');
      }

      // Verify construction object exists
      try {
        const objects = await this.getAllConstructionObjects();
        const objectExists = objects.some(obj => obj.id === objectIdNum);
        
        if (!objectExists) {
          throw new NotFoundException(`Construction object with ID ${objectId} not found`);
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        console.warn(`Could not verify construction object ${objectId}:`, error);
        throw new BadRequestException(`Cannot verify construction object with ID ${objectId}`);
      }
    }

    // Create entity instance manually to avoid TypeORM create method issues
    const metric = new KPIMetric();
    metric.name = name;
    metric.category = category;
    metric.value = value;
    metric.target = target;
    metric.frequency = frequency;
    metric.objectId = objectIdNum;
    metric.measurementDate = new Date();

    try {
      return await this.kpiRepository.save(metric);
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        throw new BadRequestException(`Construction object with ID ${objectId} does not exist`);
      }
      throw error;
    }
  }

  async getConstructionReadiness(objectId?: string): Promise<ConstructionReadinessData[]> {
    try {
      const objects = await this.getAllConstructionObjects();
      
      let filteredObjects = objects;
      if (objectId) {
        const objectIdNum = parseInt(objectId);
        if (isNaN(objectIdNum)) {
          throw new BadRequestException('Invalid object ID format');
        }
        filteredObjects = objects.filter(obj => obj.id === objectIdNum);
        
        if (filteredObjects.length === 0) {
          throw new NotFoundException(`Construction object with ID ${objectId} not found`);
        }
      }

      const readinessData: ConstructionReadinessData[] = [];

      for (const object of filteredObjects) {
        try {
          const workSchedules = await this.workSchedulesService.findByObjectId(object.id);
          const allTasks: Task[] = workSchedules.flatMap((schedule: WorkSchedule) => schedule.tasks || []);
          
          const totalTasks = allTasks.length;
          const completedTasks = allTasks.filter(task => 
            task.status === 'completed'
          ).length;
          
          const inProgressTasks = allTasks.filter(task => 
            task.status === 'in_progress'
          ).length;
          
          const delayedTasks = allTasks.filter(task => {
            if (!task.endDate) return false;
            const endDate = new Date(task.endDate);
            const today = new Date();
            return endDate < today && task.status !== 'completed';
          }).length;

          const readinessPercentage = totalTasks > 0 ? 
            Math.round((completedTasks / totalTasks) * 100) : 0;

          readinessData.push({
            objectId: object.id.toString(),
            objectName: object.name,
            totalTasks,
            completedTasks,
            inProgressTasks,
            delayedTasks,
            readinessPercentage,
            lastUpdate: object.updatedAt || object.createdAt
          });
        } catch (error) {
          console.error(`Error processing object ${object.id}:`, error);
          continue;
        }
      }

      return readinessData;
    } catch (error) {
      console.error('Error in getConstructionReadiness:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to fetch construction readiness data');
    }
  }

  async getDefectsStatistics(objectId?: string): Promise<DefectsStatistics> {
    try {
      let defects: Defect[] = [];
      
      if (objectId) {
        const objectIdNum = parseInt(objectId);
        if (isNaN(objectIdNum)) {
          throw new BadRequestException('Invalid object ID format');
        }
        defects = await this.defectsService.findAllForObject(objectIdNum);
      } else {
        defects = await this.getAllDefects();
      }

      const total = defects.length;
      
      const byStatus = defects.reduce((acc, defect) => {
        const status = defect.status || 'open';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const bySeverity = defects.reduce((acc, defect) => {
        const severity = defect.priority || 'medium';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const overdue = defects.filter(defect => {
        if (!defect.dueDate) return false;
        const dueDate = new Date(defect.dueDate);
        const today = new Date();
        return dueDate < today && defect.status !== 'fixed' && defect.status !== 'verified';
      }).length;

      return {
        total,
        byStatus,
        bySeverity,
        overdue
      };
    } catch (error) {
      console.error('Error in getDefectsStatistics:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to fetch defects statistics');
    }
  }

  async getPerformanceMetrics(objectId?: string) {
    const readinessData = await this.getConstructionReadiness(objectId);
    const defectsData = await this.getDefectsStatistics(objectId);

    return {
      readiness: readinessData,
      defects: defectsData,
      overallScore: this.calculateOverallScore(readinessData, defectsData),
      generatedAt: new Date()
    };
  }

  async getTimelineData(objectId: string, startDate: string, endDate: string) {
    try {
      const objectIdNum = parseInt(objectId);
      if (isNaN(objectIdNum)) {
        throw new BadRequestException('Invalid object ID format');
      }

      const workSchedules = await this.workSchedulesService.findByObjectId(objectIdNum);
      const allTasks: Task[] = workSchedules.flatMap((schedule: WorkSchedule) => schedule.tasks || []);
      
      const defects = await this.defectsService.findAllForObject(objectIdNum);
      const filteredDefects = defects.filter(defect => {
        const defectDate = new Date(defect.createdAt);
        return defectDate >= new Date(startDate) && defectDate <= new Date(endDate);
      });

      return {
        tasks: allTasks.map(task => ({
          id: task.id,
          name: task.name,
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status,
          progress: task.progress || 0
        })),
        defects: filteredDefects.map(defect => ({
          id: defect.id,
          title: defect.title,
          createdAt: defect.createdAt,
          dueDate: defect.dueDate,
          status: defect.status,
          severity: defect.priority
        }))
      };
    } catch (error) {
      console.error('Error in getTimelineData:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to fetch timeline data');
    }
  }

  private async generateReportData(type: string, filters: any): Promise<any> {
    try {
      switch (type) {
        case 'readiness':
          return await this.getConstructionReadiness(filters?.objectId);
        case 'defects':
          return await this.getDefectsStatistics(filters?.objectId);
        case 'performance':
          return await this.getPerformanceMetrics(filters?.objectId);
        case 'timeline':
          return await this.getTimelineData(
            filters?.objectId, 
            filters?.startDate, 
            filters?.endDate
          );
        default:
          return { message: 'Custom report data' };
      }
    } catch (error) {
      throw new Error(`Failed to generate report data: ${error.message}`);
    }
  }

  private formatKPIResponse(metric: KPIMetric): KPIResponse {
    const status = metric.value >= metric.target ? 'exceeded' : 
                   metric.value >= metric.target * 0.9 ? 'met' : 'below';
    
    return {
      metricType: metric.category,
      timeframe: metric.frequency,
      value: metric.value,
      target: metric.target,
      status,
      trend: 'stable'
    };
  }

  private calculateOverallScore(
    readinessData: ConstructionReadinessData[], 
    defectsData: DefectsStatistics
  ): number {
    if (readinessData.length === 0) return 0;

    const avgReadiness = readinessData.reduce((sum, item) => 
      sum + item.readinessPercentage, 0) / readinessData.length;

    const defectScore = Math.max(0, 100 - (defectsData.total * 2));
    const overduePenalty = Math.max(0, 100 - (defectsData.overdue * 5));

    return Math.round((avgReadiness * 0.6) + (defectScore * 0.3) + (overduePenalty * 0.1));
  }

  private async getAllConstructionObjects(): Promise<ConstructionObject[]> {
    try {
      const objects = await this.constructionObjectsService.findAll();
      return objects;
    } catch (error) {
      console.error('Error getting construction objects:', error);
      throw new Error('Failed to fetch construction objects');
    }
  }

  private async getAllDefects(): Promise<Defect[]> {
    try {
      const objects = await this.getAllConstructionObjects();
      const allDefects: Defect[] = [];
      
      for (const object of objects) {
        try {
          const defects = await this.defectsService.findAllForObject(object.id);
          allDefects.push(...defects);
        } catch (error) {
          console.error(`Error getting defects for object ${object.id}:`, error);
          continue;
        }
      }
      
      return allDefects;
    } catch (error) {
      console.error('Error in getAllDefects:', error);
      throw new Error('Failed to fetch defects');
    }
  }
}