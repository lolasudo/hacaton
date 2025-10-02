// src/work-schedules/work-schedules.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { WorkSchedule, Task } from './entities/work-schedule.entity';

// 🔔 Сервис уведомлений теперь внутри этого же файла
@Injectable()
export class NotificationsService {
  private notifications: any[] = [];

  createNotification(userId: number, message: string, type: string, relatedId: number) {
    const notification = {
      id: Date.now(),
      userId,
      message,
      type,
      relatedId,
      read: false,
      createdAt: new Date()
    };
    
    this.notifications.push(notification);
    console.log(`🔔 Создано уведомление: ${message} для пользователя ${userId}`);
    return notification;
  }

  getUnreadNotifications(userId: number) {
    return this.notifications.filter(notif => 
      notif.userId === userId && !notif.read
    );
  }

  markAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  getAllUserNotifications(userId: number) {
    return this.notifications.filter(notif => notif.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  markAllAsRead(userId: number) {
    this.notifications.forEach(notif => {
      if (notif.userId === userId && !notif.read) {
        notif.read = true;
      }
    });
  }
}

@Injectable()
export class WorkSchedulesService {
  private workSchedules: WorkSchedule[] = [];
  private idCounter = 1;
  private taskIdCounter = 1;

  // 🔔 Теперь создаем экземпляр сервиса уведомлений внутри
  private readonly notificationsService = new NotificationsService();

  // 🔧 ВАЛИДАЦИЯ ЗАВИСИМОСТЕЙ
  private validateDependencies(tasks: Task[], scheduleId?: number): void {
    const taskIds = tasks.map(task => task.id);
    
    for (const task of tasks) {
      for (const depId of task.dependencies) {
        if (!taskIds.includes(depId)) {
          throw new BadRequestException(
            `Зависимость с ID ${depId} не существует в этом графике`
          );
        }
        
        // Проверяем циклические зависимости
        if (this.hasCircularDependency(tasks, task.id, depId)) {
          throw new BadRequestException(
            `Обнаружена циклическая зависимость между задачами ${task.id} и ${depId}`
          );
        }
      }
    }
  }

  private hasCircularDependency(tasks: Task[], taskId: number, depId: number, visited: Set<number> = new Set()): boolean {
    if (taskId === depId) return true;
    if (visited.has(depId)) return false;
    
    visited.add(depId);
    const dependency = tasks.find(t => t.id === depId);
    
    if (!dependency) return false;
    
    for (const nextDepId of dependency.dependencies) {
      if (this.hasCircularDependency(tasks, taskId, nextDepId, visited)) {
        return true;
      }
    }
    
    return false;
  }

  // 📅 ВАЛИДАЦИЯ ДАТ
  private validateTaskDates(tasks: Task[]): void {
    for (const task of tasks) {
      // Проверяем что дата окончания позже даты начала
      if (task.endDate <= task.startDate) {
        throw new BadRequestException(
          `Дата окончания задачи "${task.name}" должна быть позже даты начала`
        );
      }
      
      // Проверяем что длительность соответствует датам
      const calculatedDuration = Math.ceil(
        (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (calculatedDuration !== task.duration) {
        throw new BadRequestException(
          `Длительность задачи "${task.name}" не соответствует датам начала и окончания`
        );
      }
    }
    
    // Проверяем зависимости по датам
    this.validateDependencyDates(tasks);
  }

  private validateDependencyDates(tasks: Task[]): void {
    for (const task of tasks) {
      for (const depId of task.dependencies) {
        const dependency = tasks.find(t => t.id === depId);
        if (dependency && task.startDate < dependency.endDate) {
          throw new BadRequestException(
            `Задача "${task.name}" не может начинаться раньше окончания зависимости "${dependency.name}"`
          );
        }
      }
    }
  }

  // 📊 ДАННЫЕ ДЛЯ ДИАГРАММЫ ГАНТА
  getGanttData(scheduleId: number): any {
    const schedule = this.findOne(scheduleId);
    
    const ganttData = {
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      status: schedule.status,
      tasks: schedule.tasks.map(task => ({
        id: task.id,
        name: task.name,
        start: task.startDate,
        end: task.endDate,
        progress: task.progress,
        dependencies: task.dependencies.map(depId => depId.toString()),
        status: task.status,
        assignedTo: task.assignedTo,
        duration: task.duration,
        // Дополнительные поля для фронтенда
        custom_class: task.status === 'completed' ? 'completed-task' : 
                     task.status === 'in_progress' ? 'in-progress-task' : 'not-started-task'
      })),
      // Метаданные для календаря
      calendar: {
        minDate: this.getMinDate(schedule.tasks),
        maxDate: this.getMaxDate(schedule.tasks)
      }
    };
    
    return ganttData;
  }

  private getMinDate(tasks: Task[]): Date {
    if (tasks.length === 0) return new Date();
    return new Date(Math.min(...tasks.map(task => task.startDate.getTime())));
  }

  private getMaxDate(tasks: Task[]): Date {
    if (tasks.length === 0) return new Date();
    return new Date(Math.max(...tasks.map(task => task.endDate.getTime())));
  }

  // 🎯 ОСНОВНЫЕ МЕТОДЫ С ВАЛИДАЦИЕЙ
  create(createWorkScheduleDto: CreateWorkScheduleDto): WorkSchedule {
    const tasks: Task[] = createWorkScheduleDto.tasks.map(task => ({
      id: this.taskIdCounter++,
      name: task.name,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
      duration: task.duration,
      dependencies: task.dependencies || [],
      assignedTo: task.assignedTo,
      progress: 0,
      status: 'not_started',
    }));

    // Валидация дат
    this.validateTaskDates(tasks);
    
    // Валидация зависимостей
    this.validateDependencies(tasks);

    const newSchedule: WorkSchedule = {
      id: this.idCounter++,
      objectId: createWorkScheduleDto.objectId,
      name: createWorkScheduleDto.name,
      tasks: tasks,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 1,
    };

    this.workSchedules.push(newSchedule);
    return newSchedule;
  }

  update(id: number, updateWorkScheduleDto: UpdateWorkScheduleDto): WorkSchedule {
    const scheduleIndex = this.workSchedules.findIndex(s => s.id === id);
    if (scheduleIndex === -1) {
      throw new NotFoundException(`Work schedule with ID ${id} not found`);
    }

    // ✅ Исключаем tasks из обновления - они обновляются отдельными методами
    const { tasks, ...updateData } = updateWorkScheduleDto;

    this.workSchedules[scheduleIndex] = {
      ...this.workSchedules[scheduleIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return this.workSchedules[scheduleIndex];
  }

  // ✅ КРИТИЧЕСКИ ВАЖНО: Предложить изменения графика (для прораба)
  proposeChanges(scheduleId: number, proposedTasks: any[]): WorkSchedule {
    const schedule = this.findOne(scheduleId);
    
    // Преобразуем предложенные задачи к типу Task
    const tasks: Task[] = proposedTasks.map(task => ({
      id: task.id || this.taskIdCounter++,
      name: task.name,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
      duration: task.duration,
      dependencies: task.dependencies || [],
      assignedTo: task.assignedTo,
      progress: task.progress || 0,
      status: task.status || 'not_started',
    }));

    // Валидация дат
    this.validateTaskDates(tasks);
    
    // Валидация зависимостей
    this.validateDependencies(tasks);

    schedule.tasks = tasks;
    schedule.status = 'pending_approval';
    schedule.updatedAt = new Date();

    // 🔔 Уведомление для службы контроля
    this.notificationsService.createNotification(
      schedule.createdBy, // ID службы контроля
      `Прораб предложил изменения в графике "${schedule.name}"`,
      'schedule_change_proposed',
      scheduleId
    );

    return schedule;
  }

  // ✅ КРИТИЧЕСКИ ВАЖНО: Согласовать изменения (для службы контроля)
  approveChanges(scheduleId: number, approved: boolean): WorkSchedule {
    const schedule = this.findOne(scheduleId);
    
    if (approved) {
      schedule.status = 'active';
    } else {
      schedule.status = 'draft';
    }

    schedule.updatedAt = new Date();

    // 🔔 Уведомление для прораба
    const foremanId = schedule.tasks[0]?.assignedTo || 2; // ID прораба
    this.notificationsService.createNotification(
      foremanId,
      approved ? 
        `Изменения в графике "${schedule.name}" согласованы` :
        `Изменения в графике "${schedule.name}" отклонены`,
      approved ? 'schedule_change_approved' : 'schedule_change_rejected',
      scheduleId
    );

    return schedule;
  }

  // 🔔 МЕТОДЫ ДЛЯ РАБОТЫ С УВЕДОМЛЕНИЯМИ
  getUserNotifications(userId: number) {
    return this.notificationsService.getAllUserNotifications(userId);
  }

  getUnreadNotifications(userId: number) {
    return this.notificationsService.getUnreadNotifications(userId);
  }

  markNotificationAsRead(notificationId: number) {
    this.notificationsService.markAsRead(notificationId);
  }

  markAllNotificationsAsRead(userId: number) {
    this.notificationsService.markAllAsRead(userId);
  }

  // Остальные методы остаются без изменений
  findByObjectId(objectId: number): WorkSchedule[] {
    return this.workSchedules.filter(schedule => schedule.objectId === objectId);
  }

  findOne(id: number): WorkSchedule {
    const schedule = this.workSchedules.find(s => s.id === id);
    if (!schedule) {
      throw new NotFoundException(`Work schedule with ID ${id} not found`);
    }
    return schedule;
  }

  remove(id: number): void {
    const scheduleIndex = this.workSchedules.findIndex(s => s.id === id);
    if (scheduleIndex === -1) {
      throw new NotFoundException(`Work schedule with ID ${id} not found`);
    }
    this.workSchedules.splice(scheduleIndex, 1);
  }

  updateTaskProgress(scheduleId: number, taskId: number, progress: number): WorkSchedule {
    const schedule = this.findOne(scheduleId);
    const task = schedule.tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    task.progress = Math.max(0, Math.min(100, progress)); // Ограничиваем прогресс 0-100%
    task.status = progress === 100 ? 'completed' : 
                  progress > 0 ? 'in_progress' : 'not_started';
    
    schedule.updatedAt = new Date();
    return schedule;
  }

  findAll(): WorkSchedule[] {
    return this.workSchedules;
  }
}