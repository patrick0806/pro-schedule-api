import { Controller, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';

import { DeleteServiceService } from './delete.service';

@ApiBearerAuth()
@ApiTags(API_TAGS.SERVICE)
@Controller({ version: '1' })
export class DeleteServiceController {
  constructor(private readonly deleteServiceService: DeleteServiceService) {}

  @ApiOperation({ summary: 'Delete a service' })
  @Delete(':id')
  async handle(@Param('id') id: string): Promise<void> {
    return this.deleteServiceService.execute(id);
  }
}
