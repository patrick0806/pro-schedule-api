import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';
import { PageDTO } from '@shared/dtos/page.dto';
import { ServiceDTO } from '@shared/dtos/service.dto';

import { ListServicesService } from './list.service';

@ApiBearerAuth()
@ApiTags(API_TAGS.SERVICE)
@Controller({ version: '1' })
export class ListServicesController {
  constructor(private readonly listServicesService: ListServicesService) {}

  @ApiOperation({ summary: 'List all services' })
  @Get()
  async handle(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PageDTO<ServiceDTO>> {
    return this.listServicesService.execute(page, size);
  }
}
