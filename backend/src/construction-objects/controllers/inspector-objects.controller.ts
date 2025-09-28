import {
  Controller,
  Post,
  Param,
  UseGuards,
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
@Roles(RoleEnum.INSPECTOR)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Inspector Objects')
@Controller({
  path: 'inspector/objects',
  version: '1',
})
export class InspectorObjectsController {
  constructor(private readonly objectsService: ConstructionObjectsService) {}

  @Post(':id/activate')
  @ApiOperation({ summary: 'Активировать объект' })
  @ApiResponse({ status: 200, type: ConstructionObject })
  @HttpCode(HttpStatus.OK)
  activateObject(@Param('id') id: string) {
    return this.objectsService.activateObject(+id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Завершить объект' })
  @ApiResponse({ status: 200, type: ConstructionObject })
  @HttpCode(HttpStatus.OK)
  completeObject(@Param('id') id: string) {
    return this.objectsService.completeObject(+id);
  }
}