import {
  Controller,
  Get,
  Param,
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
import { ConstructionObject } from '../domain/construction-object';

@ApiBearerAuth()
@Roles(RoleEnum.CONTRACTOR)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Contractor Objects')
@Controller({
  path: 'contractor/objects',
  version: '1',
})
export class ContractorObjectsController {
  constructor(private readonly objectsService: ConstructionObjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить мои объекты' })
  @ApiResponse({ status: 200, type: [ConstructionObject] })
  @HttpCode(HttpStatus.OK)
  findMyObjects(@Request() req) {
    return this.objectsService.findByContractorId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить объект по ID' })
  @ApiResponse({ status: 200, type: ConstructionObject })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.objectsService.findById(+id);
  }
}