import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';
import { ServiceDTO } from '@shared/dtos/service.dto';

import { FindServiceService } from './find.service';

@ApiBearerAuth()
@ApiTags(API_TAGS.SERVICE)
@Controller({ version: '1' })
export class FindServiceController {
  constructor(private readonly findServiceService: FindServiceService) {}

  @ApiOperation({ summary: 'Find a service' })
  @Get(':id')
  async handle(@Param('id') id: string): Promise<ServiceDTO> {
    return this.findServiceService.execute(id);
  }
}
