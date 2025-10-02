// src/defects/services/comments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      createdAt: new Date(),
    });
    return await this.commentsRepository.save(comment);
  }

  async findByDefect(defectId: number): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { defectId },
      order: { createdAt: 'ASC' },
    });
  }

  async findByViolation(violationId: number): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { violationId },
      order: { createdAt: 'ASC' },
    });
  }
}