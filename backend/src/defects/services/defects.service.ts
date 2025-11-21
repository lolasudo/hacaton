// src/defects/services/defects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defect, DefectStatus, DefectPriority } from '../entities/defect.entity';
import { CreateDefectDto } from '../dto/create-defect.dto';
import { UpdateDefectStatusDto } from '../dto/update-defect-status.dto';
import { AssignDefectDto } from '../dto/assign-defect.dto';

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect)
    private defectsRepository: Repository<Defect>,
  ) {}

  async create(createDefectDto: CreateDefectDto, createdById: number): Promise<Defect> {
    const defect = this.defectsRepository.create({
      ...createDefectDto,
      createdById,
      status: DefectStatus.OPEN,
    });

    const savedDefect = await this.defectsRepository.save(defect);
    return savedDefect;
  }

  async findAllForObject(objectId: number): Promise<Defect[]> {
    return await this.defectsRepository.find({
      where: { objectId },
      order: { 
        priority: 'DESC',
        createdAt: 'DESC' 
      },
    });
  }

  async findOne(id: number): Promise<Defect> {
    const defect = await this.defectsRepository.findOne({
      where: { id },
    });

    if (!defect) {
      throw new NotFoundException(`Defect with ID ${id} not found`);
    }

    return defect;
  }

  async updateStatus(id: number, updateDefectStatusDto: UpdateDefectStatusDto): Promise<Defect> {
    const defect = await this.findOne(id);
    
    defect.status = updateDefectStatusDto.status;
    
    if (updateDefectStatusDto.status === DefectStatus.FIXED) {
      defect.fixedAt = new Date();
      if (updateDefectStatusDto.resolutionDetails) {
        defect.resolutionDetails = updateDefectStatusDto.resolutionDetails;
      }
    } else if (updateDefectStatusDto.status === DefectStatus.VERIFIED) {
      defect.verifiedAt = new Date();
    } else if (updateDefectStatusDto.status === DefectStatus.IN_PROGRESS) {
      defect.inProgressAt = new Date();
    }

    defect.updatedAt = new Date();
    
    return await this.defectsRepository.save(defect);
  }

  async assign(defectId: number, assignDefectDto: AssignDefectDto): Promise<Defect> {
    const defect = await this.findOne(defectId);
    defect.assignedToId = assignDefectDto.assignedToId;
    defect.updatedAt = new Date();
    
    return await this.defectsRepository.save(defect);
  }

  async getDefectStats(objectId: number): Promise<any> {
    const defects = await this.defectsRepository.find({
      where: { objectId },
    });

    const today = new Date();
    const overdueDefects = defects.filter(defect => 
      defect.dueDate < today && 
      ![DefectStatus.FIXED, DefectStatus.VERIFIED].includes(defect.status)
    );

    const stats = {
      total: defects.length,
      byStatus: {
        [DefectStatus.OPEN]: defects.filter(d => d.status === DefectStatus.OPEN).length,
        [DefectStatus.IN_PROGRESS]: defects.filter(d => d.status === DefectStatus.IN_PROGRESS).length,
        [DefectStatus.FIXED]: defects.filter(d => d.status === DefectStatus.FIXED).length,
        [DefectStatus.VERIFIED]: defects.filter(d => d.status === DefectStatus.VERIFIED).length,
      },
      byPriority: {
        [DefectPriority.CRITICAL]: defects.filter(d => d.priority === DefectPriority.CRITICAL).length,
        [DefectPriority.HIGH]: defects.filter(d => d.priority === DefectPriority.HIGH).length,
        [DefectPriority.MEDIUM]: defects.filter(d => d.priority === DefectPriority.MEDIUM).length,
        [DefectPriority.LOW]: defects.filter(d => d.priority === DefectPriority.LOW).length,
      },
      overdue: overdueDefects.length,
      requiresVerification: defects.filter(d => d.requiresVerification).length,
    };

    return stats;
  }

  async getOverdueDefects(): Promise<Defect[]> {
    const today = new Date();
    return await this.defectsRepository
      .createQueryBuilder('defect')
      .where('defect.dueDate < :today', { today })
      .andWhere('defect.status NOT IN (:...closedStatuses)', {
        closedStatuses: [DefectStatus.FIXED, DefectStatus.VERIFIED],
      })
      .orderBy('defect.dueDate', 'ASC')
      .getMany();
  }

  async getDefectsByPriority(priority: DefectPriority): Promise<Defect[]> {
    return await this.defectsRepository.find({
      where: { priority },
      order: { createdAt: 'DESC' },
    });
  }

  async searchDefects(objectId: number, searchTerm: string): Promise<Defect[]> {
    return await this.defectsRepository
      .createQueryBuilder('defect')
      .where('defect.objectId = :objectId', { objectId })
      .andWhere(
        '(defect.title ILIKE :searchTerm OR defect.description ILIKE :searchTerm OR defect.category ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      )
      .orderBy('defect.createdAt', 'DESC')
      .getMany();
  }

  async findAll(): Promise<Defect[]> {
    return await this.defectsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}