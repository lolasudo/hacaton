import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Violation, ViolationStatus } from '../entities/violation.entity';
import { CreateViolationDto } from '../dto/create-violation.dto';

@Injectable()
export class ViolationsService {
  constructor(
    @InjectRepository(Violation)
    private violationsRepository: Repository<Violation>,
  ) {}

  async create(createViolationDto: CreateViolationDto): Promise<Violation> {
    const violation = this.violationsRepository.create({
      ...createViolationDto,
      status: ViolationStatus.OPEN,
      createdById: 1, // 🔥 ВРЕМЕННО: заглушка
      createdAt: new Date(),
    });
    return await this.violationsRepository.save(violation);
  }

  async findAllForObject(objectId: number): Promise<Violation[]> {
    return await this.violationsRepository.find({
      where: { objectId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Violation> {
    const violation = await this.violationsRepository.findOne({
      where: { id },
    });
    
    if (!violation) {
      throw new NotFoundException(`Violation with ID ${id} not found`);
    }
    
    return violation;
  }

  async updateStatus(id: number, status: ViolationStatus): Promise<Violation> {
    const violation = await this.findOne(id);
    violation.status = status;
    violation.updatedAt = new Date();
    return await this.violationsRepository.save(violation);
  }

  async assignViolation(id: number, assignedToId: number): Promise<Violation> {
    const violation = await this.findOne(id);
    violation.assignedToId = assignedToId;
    violation.updatedAt = new Date();
    return await this.violationsRepository.save(violation);
  }
}