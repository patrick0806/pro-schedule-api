import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlanRepository } from '@shared/repositories/plan.repository';
import { ServiceRepository } from '@shared/repositories/service.repository';

import { CreateServiceService } from '../create.service';
import { CreateServiceRequestDTO } from '../dtos/request.dto';

describe('CreateServiceService', () => {
  let service: CreateServiceService;
  let serviceRepository: ServiceRepository;
  let planRepository: PlanRepository;

  const mockService = {
    id: 'any_id',
    name: 'Manicure',
    description: 'A simple manicure service',
    priceInCents: 5000,
    durationInMinutes: 60,
    isActive: true,
    businessId: 'any_business_id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    businessId: 'any_business_id',
    planId: 'any_plan_id',
    userId: 'any_user_id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateServiceService,
        {
          provide: ServiceRepository,
          useValue: {
            save: vi.fn().mockResolvedValue(mockService),
            countServicesByBusiness: vi.fn().mockResolvedValue(0),
          },
        },
        {
          provide: PlanRepository,
          useValue: {
            findById: vi.fn().mockResolvedValue({ serviceLimit: 10 }),
          },
        },
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
    planRepository = module.get<PlanRepository>(PlanRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    const createServiceRequestDTO: CreateServiceRequestDTO = {
      name: 'Manicure',
      description: 'A simple manicure service',
      priceInCents: 5000,
      durationInMinutes: 60,
      isActive: true,
    };

    it('should create a service', async () => {
      const result = await service.execute(createServiceRequestDTO, mockUser);

      expect(planRepository.findById).toHaveBeenCalledWith(mockUser.planId);
      expect(serviceRepository.countServicesByBusiness).toHaveBeenCalledWith(
        mockUser.businessId,
      );
      expect(serviceRepository.save).toHaveBeenCalledWith(
        createServiceRequestDTO,
      );
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException if plan is not found', async () => {
      vi.spyOn(planRepository, 'findById').mockResolvedValueOnce(undefined);

      await expect(
        service.execute(createServiceRequestDTO, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if service limit is reached', async () => {
      vi.spyOn(serviceRepository, 'countServicesByBusiness').mockResolvedValueOnce(
        10,
      );
      vi.spyOn(planRepository, 'findById').mockResolvedValueOnce({
        serviceLimit: 10,
      });

      await expect(
        service.execute(createServiceRequestDTO, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
