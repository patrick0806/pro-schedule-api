import { Injectable, NotFoundException } from '@nestjs/common';

import { ServiceRepository } from '@shared/repositories/service.repository';

@Injectable()
export class DeleteServiceService {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.deleteById(id);
  }
}
