import { Injectable, NotFoundException } from '@nestjs/common';

import { ServiceDTO } from '@shared/dtos/service.dto';
import { ServiceRepository } from '@shared/repositories/service.repository';

@Injectable()
export class FindServiceService {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(id: string): Promise<ServiceDTO> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return {
      ...service,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(service.priceInCents / 100),
    };
  }
}
