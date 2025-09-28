import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { ConstructionObjectsService } from '../services/construction-objects.service';
import { CreateObjectDto } from '../dto/create-object.dto';
import { UpdateObjectDto } from '../dto/update-object.dto';
import { ConstructionObject } from '../domain/construction-object';

@ApiBearerAuth()
@Roles(RoleEnum.CUSTOMER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Customer Objects')
@Controller({
  path: 'customer/objects',
  version: '1',
})
export class CustomerObjectsController {
  constructor(private readonly objectsService: ConstructionObjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать объект' })
  @ApiResponse({ status: 201, type: ConstructionObject })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createObjectDto: CreateObjectDto, @Request() req) {
    return this.objectsService.create(createObjectDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить мои объекты' })
  @ApiResponse({ status: 200, type: [ConstructionObject] })
  @HttpCode(HttpStatus.OK)
  findMyObjects(@Request() req) {
    return this.objectsService.findByCustomerId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить объект по ID' })
  @ApiResponse({ status: 200, type: ConstructionObject })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.objectsService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить объект' })
  @ApiResponse({ status: 200, type: ConstructionObject })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateObjectDto: UpdateObjectDto) {
    return this.objectsService.update(+id, updateObjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить объект' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.objectsService.remove(+id);
  }
}