import { Injectable } from '@nestjs/common';

import { PageDTO } from '@shared/dtos/page.dto';
import { ServiceDTO } from '@shared/dtos/service.dto';
import { ServiceRepository } from '@shared/repositories/service.repository';

@Injectable()
export class ListServicesService {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(page: number, size: number): Promise<PageDTO<ServiceDTO>> {
    const { content, ...pageInfo } = await this.serviceRepository.list(
      page,
      size,
    );

    return {
      ...pageInfo,
      content: content.map((service) => ({
        ...service,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(service.priceInCents / 100),
      })),
    };
  }
}
