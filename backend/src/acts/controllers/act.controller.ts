import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  Res,
  Header 
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ActService } from '../services/act.service';
import { CreateActDto } from '../dto/create-act.dto';
import { UpdateActDto } from '../dto/update-act.dto';
import { ActEntity } from '../entities/act.entity';

@Controller('acts')
export class ActController {
  constructor(private readonly actService: ActService) {}

  @Get()
  async findAll(): Promise<ActEntity[]> {
    return this.actService.findAll();
  }

  @Get('object/:objectId')
  async findByObjectId(@Param('objectId', ParseIntPipe) objectId: number): Promise<ActEntity[]> {
    return this.actService.findByObjectId(objectId);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ActEntity> {
    return this.actService.findById(id);
  }

  @Post()
  async create(@Body() createActDto: CreateActDto): Promise<ActEntity> {
    return this.actService.create(createActDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActDto: UpdateActDto
  ): Promise<ActEntity> {
    return this.actService.update(id, updateActDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.actService.delete(id);
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="act.pdf"')
  async generatePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const pdfBuffer = await this.actService.generateActPdf(id);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Ошибка генерации PDF' });
    }
  }

  @Post(':id/attachments')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadAttachments(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return { message: 'Files uploaded successfully', filesCount: files.length };
  }
}