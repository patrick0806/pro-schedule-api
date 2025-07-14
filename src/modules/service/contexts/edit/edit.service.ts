import { Injectable, NotFoundException } from '@nestjs/common';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { EditServiceRequestDTO } from './dtos/request.dto';

@Injectable()
export class EditServiceService {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(id: string, data: EditServiceRequestDTO): Promise<void> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.save({ ...service, ...data });
  }
}
