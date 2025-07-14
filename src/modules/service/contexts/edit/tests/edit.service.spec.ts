import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { EditServiceRequestDTO } from '../dtos/request.dto';
import { EditServiceService } from '../edit.service';

describe('EditServiceService', () => {
  let service: EditServiceService;
  let serviceRepository: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditServiceService,
        {
          provide: ServiceRepository,
          useValue: {
            findById: vi.fn(),
            save: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EditServiceService>(EditServiceService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should edit a service', async () => {
      const editServiceRequestDTO: EditServiceRequestDTO = {
        name: 'Manicure',
        description: 'A simple manicure service',
        priceInCents: 5000,
        durationInMinutes: 60,
        isActive: true,
      };

      vi.mocked(serviceRepository.findById).mockResolvedValue({} as any);

      await service.execute('some-id', editServiceRequestDTO);

      expect(serviceRepository.save).toHaveBeenCalledWith({
        ...editServiceRequestDTO,
      });
    });

    it('should throw NotFoundException when service does not exist', async () => {
      const editServiceRequestDTO: EditServiceRequestDTO = {
        name: 'Manicure',
        description: 'A simple manicure service',
        priceInCents: 5000,
        durationInMinutes: 60,
        isActive: true,
      };

      vi.mocked(serviceRepository.findById).mockResolvedValue(null);

      await expect(
        service.execute('some-id', editServiceRequestDTO),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
