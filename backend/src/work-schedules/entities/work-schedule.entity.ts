export interface Task {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  progress: number;
  dependencies: number[]; // ✅ гарантированно массив
  assignedTo?: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface WorkSchedule {
  id: number;
  objectId: number;
  name: string;
  tasks: Task[];
  status: 'draft' | 'active' | 'completed' | 'pending_approval';
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}