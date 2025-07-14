import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { CreateServiceService } from '../create.service';
import { CreateServiceRequestDTO } from '../dtos/request.dto';

describe('CreateServiceService', () => {
  let service: CreateServiceService;
  let serviceRepository: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateServiceService,
        {
          provide: ServiceRepository,
          useValue: {
            save: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should create a service', async () => {
      const createServiceRequestDTO: CreateServiceRequestDTO = {
        name: 'Manicure',
        description: 'A simple manicure service',
        priceInCents: 5000,
        durationInMinutes: 60,
        isActive: true,
      };

      await service.execute(createServiceRequestDTO);

      expect(serviceRepository.save).toHaveBeenCalledWith(
        createServiceRequestDTO,
      );
    });
  });
});
