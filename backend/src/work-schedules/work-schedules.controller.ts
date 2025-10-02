// src/work-schedules/work-schedules.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkSchedulesService } from './work-schedules.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('work-schedules')
@Controller('work-schedules')
export class WorkSchedulesController {
  constructor(private readonly workSchedulesService: WorkSchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый график работ' })
  create(@Body() createWorkScheduleDto: CreateWorkScheduleDto) {
    return this.workSchedulesService.create(createWorkScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все графики' })
  findAll() {
    return this.workSchedulesService.findAll();
  }

  @Get('object/:objectId')
  @ApiOperation({ summary: 'Получить все графики для объекта' })
  findByObjectId(@Param('objectId') objectId: string) {
    return this.workSchedulesService.findByObjectId(+objectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить график по ID' })
  findOne(@Param('id') id: string) {
    return this.workSchedulesService.findOne(+id);
  }

  @Get(':id/gantt-data')
  @ApiOperation({ summary: 'Получить данные для диаграммы Ганта' })
  getGanttData(@Param('id') id: string) {
    return this.workSchedulesService.getGanttData(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить график' })
  update(@Param('id') id: string, @Body() updateWorkScheduleDto: UpdateWorkScheduleDto) {
    return this.workSchedulesService.update(+id, updateWorkScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить график' })
  remove(@Param('id') id: string) {
    return this.workSchedulesService.remove(+id);
  }

  // ✅ КРИТИЧЕСКИ ВАЖНО: Эндпоинты для workflow согласования

  @Post(':id/propose-changes')
  @ApiOperation({ summary: 'Предложить изменения графика (для прораба)' })
  proposeChanges(@Param('id') id: string, @Body() body: { tasks: any[] }) {
    return this.workSchedulesService.proposeChanges(+id, body.tasks);
  }

  @Post(':id/approve-changes')
  @ApiOperation({ summary: 'Согласовать/отклонить изменения (для службы контроля)' })
  approveChanges(
    @Param('id') id: string, 
    @Body() body: { approved: boolean }
  ) {
    return this.workSchedulesService.approveChanges(+id, body.approved);
  }

  @Patch(':scheduleId/tasks/:taskId/progress')
  @ApiOperation({ summary: 'Обновить прогресс задачи' })
  updateTaskProgress(
    @Param('scheduleId') scheduleId: string,
    @Param('taskId') taskId: string,
    @Body() body: { progress: number }
  ) {
    return this.workSchedulesService.updateTaskProgress(+scheduleId, +taskId, body.progress);
  }

  // 🔔 ЭНДПОИНТЫ ДЛЯ УВЕДОМЛЕНИЙ
  @Get('notifications/user/:userId')
  @ApiOperation({ summary: 'Получить уведомления пользователя' })
  getUserNotifications(@Param('userId') userId: string) {
    return this.workSchedulesService.getUserNotifications(+userId);
  }

  @Get('notifications/user/:userId/unread')
  @ApiOperation({ summary: 'Получить непрочитанные уведомления пользователя' })
  getUnreadNotifications(@Param('userId') userId: string) {
    return this.workSchedulesService.getUnreadNotifications(+userId);
  }

  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'Отметить уведомление как прочитанное' })
  markNotificationAsRead(@Param('id') id: string) {
    this.workSchedulesService.markNotificationAsRead(+id);
    return { message: 'Уведомление прочитано' };
  }

  @Patch('notifications/user/:userId/read-all')
  @ApiOperation({ summary: 'Отметить все уведомления пользователя как прочитанные' })
  markAllNotificationsAsRead(@Param('userId') userId: string) {
    this.workSchedulesService.markAllNotificationsAsRead(+userId);
    return { message: 'Все уведомления прочитаны' };
  }
}