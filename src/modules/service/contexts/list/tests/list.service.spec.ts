import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { ListServicesService } from '../list.service';

describe('ListServicesService', () => {
  let service: ListServicesService;
  let serviceRepository: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListServicesService,
        {
          provide: ServiceRepository,
          useValue: {
            list: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ListServicesService>(ListServicesService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should list services with pagination', async () => {
      const servicesData = [
        {
          id: 'some-id',
          name: 'Manicure',
          description: 'A simple manicure service',
          priceInCents: 5000,
          durationInMinutes: 60,
          isActive: true,
        },
      ];

      vi.mocked(serviceRepository.list).mockResolvedValue({
        content: servicesData,
        page: 1,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      } as any);

      const result = await service.execute(1, 10);

      expect(serviceRepository.list).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        content: [
          {
            ...servicesData[0],
            price: 'R$ 50,00',
          },
        ],
        page: 1,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      });
    });
  });
});
