import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ServiceDTO } from '@shared/dtos/service.dto';
import { IAccessToken } from '@shared/interfaces/tokens.interface';
import { PlanRepository } from '@shared/repositories/plan.repository';
import { ServiceRepository } from '@shared/repositories/service.repository';

import { CreateServiceRequestDTO } from './dtos/request.dto';

@Injectable()
export class CreateServiceService {
  constructor(
    private serviceRepository: ServiceRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute(
    data: CreateServiceRequestDTO,
    user: IAccessToken,
  ): Promise<ServiceDTO> {
    const plan = await this.planRepository.findById(user.planId);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const currentAmoutOfServices =
      await this.serviceRepository.countServicesByBusiness(user.businessId);
    if (currentAmoutOfServices >= plan.serviceLimit) {
      throw new ForbiddenException('Plan limit reached');
    }

    const service = this.serviceRepository.save(data);
    return plainToInstance(ServiceDTO, service);
  }
}
