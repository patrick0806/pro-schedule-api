import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceRepository } from '@shared/repositories/service.repository';

import { DeleteServiceService } from '../delete.service';

describe('DeleteServiceService', () => {
  let service: DeleteServiceService;
  let serviceRepository: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteServiceService,
        {
          provide: ServiceRepository,
          useValue: {
            findById: vi.fn(),
            deleteById: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteServiceService>(DeleteServiceService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should deleteById a service', async () => {
      vi.mocked(serviceRepository.findById).mockResolvedValue({} as any);

      await service.execute('some-id');

      expect(serviceRepository.deleteById).toHaveBeenCalledWith('some-id');
    });

    it('should throw NotFoundException when service does not exist', async () => {
      vi.mocked(serviceRepository.findById).mockResolvedValue(null);

      await expect(service.execute('some-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
