import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';

import { CreateServiceService } from './create.service';
import { CreateServiceRequestDTO } from './dtos/request.dto';
import { ServiceDTO } from '@shared/dtos/service.dto';

@ApiBearerAuth()
@ApiTags(API_TAGS.SERVICE)
@Controller({ version: '1' })
export class CreateServiceController {
  constructor(private readonly createServiceService: CreateServiceService) { }

  @ApiOperation({ summary: 'Create a new service' })
  @Post()
  async handle(@Body() data: CreateServiceRequestDTO): Promise<ServiceDTO> {
    return this.createServiceService.execute(data);
  }
}
