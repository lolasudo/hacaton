// src/modules/reporting/interfaces/reporting.interface.ts
export interface ConstructionReadinessData {
  objectId: string;
  objectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
  readinessPercentage: number;
  lastUpdate: Date;
}

export interface DefectsStatistics {
  total: number;
  byStatus: { [status: string]: number };
  bySeverity: { [severity: string]: number };
  overdue: number;
}

export interface KPIResponse {
  metricType: string;
  timeframe: string;
  value: number;
  target: number;
  status: 'exceeded' | 'met' | 'below';
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge';
  title: string;
  data: any;
  position: { x: number; y: number; w: number; h: number };
}