// src/defects/controllers/comments.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать комментарий' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('defect/:defectId')
  @ApiOperation({ summary: 'Получить комментарии к замечанию' })
  findByDefect(@Param('defectId') defectId: string) {
    return this.commentsService.findByDefect(+defectId);
  }

  @Get('violation/:violationId')
  @ApiOperation({ summary: 'Получить комментарии к нарушению' })
  findByViolation(@Param('violationId') violationId: string) {
    return this.commentsService.findByViolation(+violationId);
  }
}