import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActEntity } from '../entities/act.entity';
import { CreateActDto } from '../dto/create-act.dto';
import { UpdateActDto } from '../dto/update-act.dto';

@Injectable()
export class ActService {
  constructor(
    @InjectRepository(ActEntity)
    private readonly actRepository: Repository<ActEntity>,
  ) {}

  async findAll(): Promise<ActEntity[]> {
    return this.actRepository.find({
      relations: ['object', 'createdBy', 'attachments']
    });
  }

  async findById(id: number): Promise<ActEntity> {
    const act = await this.actRepository.findOne({
      where: { id },
      relations: ['object', 'createdBy', 'attachments']
    });

    if (!act) {
      throw new NotFoundException(`Act with ID ${id} not found`);
    }

    return act;
  }

  async findByObjectId(objectId: number): Promise<ActEntity[]> {
    return this.actRepository.find({
      where: { object: { id: objectId } },
      relations: ['createdBy', 'attachments', 'object']
    });
  }

  async create(createActDto: CreateActDto): Promise<ActEntity> {
    const act = this.actRepository.create(createActDto);
    return this.actRepository.save(act);
  }

  async update(id: number, updateActDto: UpdateActDto): Promise<ActEntity> {
    const act = await this.findById(id);
    Object.assign(act, updateActDto);
    return this.actRepository.save(act);
  }

  async delete(id: number): Promise<void> {
    const result = await this.actRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Act with ID ${id} not found`);
    }
  }

  async generateActPdf(actId: number): Promise<Buffer> {
    const act = await this.findById(actId);
    return Buffer.from(`PDF for Act ${act.actNumber}`);
  }
}