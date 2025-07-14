import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { FindServiceService } from '../find.service';

describe('FindServiceService', () => {
  let service: FindServiceService;
  let serviceRepository: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindServiceService,
        {
          provide: ServiceRepository,
          useValue: {
            findById: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindServiceService>(FindServiceService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should find a service', async () => {
      const serviceData = {
        id: 'some-id',
        name: 'Manicure',
        description: 'A simple manicure service',
        priceInCents: 5000,
        durationInMinutes: 60,
        isActive: true,
      };

      vi.mocked(serviceRepository.findById).mockResolvedValue(
        serviceData as any,
      );

      const result = await service.execute('some-id');

      expect(result).toEqual({
        ...serviceData,
        price: 'R$ 50,00',
      });
    });

    it('should throw NotFoundException when service does not exist', async () => {
      vi.mocked(serviceRepository.findById).mockResolvedValue(null);

      await expect(service.execute('some-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
