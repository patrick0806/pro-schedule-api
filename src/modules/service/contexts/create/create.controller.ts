import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';
import { ServiceDTO } from '@shared/dtos/service.dto';
import { IRequest } from '@shared/interfaces/request.interface';

import { CreateServiceService } from './create.service';
import { CreateServiceRequestDTO } from './dtos/request.dto';

@ApiBearerAuth()
@ApiTags(API_TAGS.SERVICE)
@Controller({ version: '1' })
export class CreateServiceController {
  constructor(private readonly createServiceService: CreateServiceService) {}

  @ApiOperation({ summary: 'Create a new service' })
  @Post()
  async handle(
    @Body() data: CreateServiceRequestDTO,
    @Req() req: IRequest,
  ): Promise<ServiceDTO> {
    return this.createServiceService.execute(data, req.user);
  }
}
