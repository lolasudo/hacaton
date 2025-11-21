
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Param,
  Query,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { TTNService } from '../services/ttn.service';
import { CreateTTNDto } from '../dto/create-ttn.dto';
import { UpdateTTNDto } from '../dto/update-ttn.dto';
import { UpdateTTNStatusDto } from '../dto/update-ttn-status.dto';
import { GetTTNListDto } from '../dto/get-ttn-list.dto';
import { TTN } from '../domain/ttn';
import { YandexVisionOCRService } from '../infrastructure/ocr/yandex-ocr.service';

const CONTROL_ROLES = [RoleEnum.ADMIN];
const CONTRACTOR_ROLES = [RoleEnum.CONTRACTOR, RoleEnum.ADMIN];

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('TTN')
@Controller({
  path: 'ttn',
  version: '1',
})
export class TTNController {
  constructor(
    private readonly ttnService: TTNService,
    private readonly ocrService: YandexVisionOCRService,
  ) {}

  @Post('upload')
  @Roles(RoleEnum.CONTRACTOR)
  @ApiOperation({ summary: 'Загрузить ТТН с фото для распознавания' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadTTN(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTTNDto: CreateTTNDto,
    @Request() req,
  ): Promise<TTN> {
    try {
      if (!file) {
        throw new BadRequestException('Файл не загружен');
      }

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Недопустимый тип файла. Разрешены только JPEG, PNG');
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException('Размер файла не должен превышать 10 МБ');
      }

      const recognitionResult = await this.ocrService.recognizeTTN(file.buffer);

      return await this.ttnService.processTTNWithOCR(
        file, 
        createTTNDto,
        req.user.id, 
        recognitionResult
      );

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      return await this.ttnService.processTTN(file, createTTNDto, req.user.id);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить список ТТН с фильтрацией' })
  async getTTNList(
    @Query() filters: GetTTNListDto,
    @Request() req,
  ) {
    if (req.user.role === RoleEnum.CONTRACTOR) {
      filters.contractorId = req.user.id;
    }
    
    return this.ttnService.findAll({
      ...filters,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ТТН по ID' })
  async getTTNById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const ttn = await this.ttnService.findById(id);
    if (!ttn) {
      throw new NotFoundException(`TTN with id ${id} not found`);
    }

    if (req.user.role === RoleEnum.CONTRACTOR && ttn.contractorId !== req.user.id) {
      throw new NotFoundException(`TTN with id ${id} not found`);
    }

    return ttn;
  }

  @Patch(':id')
  @Roles(...CONTRACTOR_ROLES)
  @ApiOperation({ summary: 'Обновить данные ТТН' })
  async updateTTN(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTTNDto: UpdateTTNDto,
    @Request() req,
  ) {
    if (req.user.role === RoleEnum.CONTRACTOR) {
      const ttn = await this.ttnService.findById(id);
      if (!ttn || ttn.contractorId !== req.user.id) {
        throw new NotFoundException(`TTN with id ${id} not found`);
      }
    }
    return this.ttnService.update(id, updateTTNDto);
  }

  @Patch(':id/status')
  @Roles(...CONTROL_ROLES)
  @ApiOperation({ summary: 'Обновить статус ТТН' })
  async updateTTNStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTTNStatusDto,
    @Request() req,
  ) {
    return this.ttnService.updateStatus(id, updateStatusDto, req.user.id);
  }

  @Get('object/:objectId')
  @ApiOperation({ summary: 'Получить ТТН по объекту строительства' })
  async getTTNByObject(
    @Param('objectId', ParseIntPipe) objectId: number,
    @Request() req,
  ) {
    if (req.user.role === RoleEnum.CONTRACTOR) {
      const result = await this.ttnService.findAll({
        constructionObjectId: objectId,
        contractorId: req.user.id,
      });
      return result.data;
    }
    return this.ttnService.findByConstructionObjectId(objectId);
  }

  @Delete(':id')
  @Roles(...CONTRACTOR_ROLES)
  @ApiOperation({ summary: 'Удалить ТТН' })
  async deleteTTN(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    if (req.user.role === RoleEnum.CONTRACTOR) {
      const ttn = await this.ttnService.findById(id);
      if (!ttn || ttn.contractorId !== req.user.id) {
        throw new NotFoundException(`TTN with id ${id} not found`);
      }
    }
    return this.ttnService.delete(id);
  }

  @Post(':id/verify')
  @Roles(...CONTROL_ROLES)
  @ApiOperation({ summary: 'Верифицировать ТТН' })
  async verifyTTN(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.ttnService.verifyTTN(id, req.user.id);
  }

  @Post(':id/reject')
  @Roles(...CONTROL_ROLES)
  @ApiOperation({ summary: 'Отклонить ТТН' })
  async rejectTTN(
    @Param('id', ParseIntPipe) id: number,
    @Body('comment') comment: string,
    @Request() req,
  ) {
    return this.ttnService.rejectTTN(id, comment, req.user.id);
  }

  @Post(':id/lab-test')
  @Roles(...CONTROL_ROLES)
  @ApiOperation({ summary: 'Запросить лабораторные испытания' })
  async requestLabTest(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.ttnService.requestLabTest(id, req.user.id);
  }

  @Get('my/ttn')
  @Roles(RoleEnum.CONTRACTOR)
  @ApiOperation({ summary: 'Получить мои ТТН (для подрядчика)' })
  async getMyTTN(@Request() req) {
    return this.ttnService.findByContractorId(req.user.id);
  }

  @Get('search/by-invoice/:invoiceNumber')
  @ApiOperation({ summary: 'Найти ТТН по номеру накладной' })
  async searchByInvoiceNumber(
    @Param('invoiceNumber') invoiceNumber: string,
    @Request() req,
  ) {
    const ttn = await this.ttnService.findByInvoiceNumber(invoiceNumber);
    
    if (!ttn) {
      throw new NotFoundException(`TTN with number ${invoiceNumber} not found`);
    }

    if (req.user.role === RoleEnum.CONTRACTOR && ttn.contractorId !== req.user.id) {
      throw new NotFoundException(`TTN with number ${invoiceNumber} not found`);
    }

    return ttn;
  }
}