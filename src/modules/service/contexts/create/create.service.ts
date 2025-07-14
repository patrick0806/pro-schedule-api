import { Injectable } from '@nestjs/common';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { CreateServiceRequestDTO } from './dtos/request.dto';
import { ServiceDTO } from '@shared/dtos/service.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateServiceService {
  constructor(private serviceRepository: ServiceRepository) { }

  async execute(data: CreateServiceRequestDTO): Promise<ServiceDTO> {
    const service = this.serviceRepository.save(data);
    return plainToInstance(ServiceDTO, service);
  }
}
