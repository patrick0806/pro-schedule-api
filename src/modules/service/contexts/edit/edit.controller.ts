import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';

import { EditServiceRequestDTO } from './dtos/request.dto';
import { EditServiceService } from './edit.service';

@ApiBearerAuth()
@ApiTags(API_TAGS.SERVICE)
@Controller({ version: '1' })
export class EditServiceController {
  constructor(private readonly editServiceService: EditServiceService) {}

  @ApiOperation({ summary: 'Edit a service' })
  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body() data: EditServiceRequestDTO,
  ): Promise<void> {
    return this.editServiceService.execute(id, data);
  }
}
