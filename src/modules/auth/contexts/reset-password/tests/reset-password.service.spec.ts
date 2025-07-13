import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';

import { ResetPasswordService } from '../reset-password.service';
import { PasswordResetRepository } from '@shared/repositories/password-reset.repository';
import { UserRepository } from '@shared/repositories/user.repository';

vi.mock('bcrypt', () => ({
  compare: vi.fn(),
}));

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;
  let passwordResetRepository: PasswordResetRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        {
          provide: PasswordResetRepository,
          useValue: {
            findByToken: vi.fn(),
            delete: vi.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: vi.fn(),
            save: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResetPasswordService>(ResetPasswordService);
    passwordResetRepository = module.get<PasswordResetRepository>(
      PasswordResetRepository,
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should reset password with valid token', async () => {
      vi.mocked(passwordResetRepository.findByToken).mockResolvedValue({
        email: 'test@example.com',
        created_at: new Date(),
      } as any);
      vi.mocked(userRepository.findByEmail).mockResolvedValue({} as any);

      await service.execute({
        token: 'valid-token',
        password: 'new-password',
      });

      expect(userRepository.save).toHaveBeenCalled();
      expect(passwordResetRepository.delete).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      vi.mocked(passwordResetRepository.findByToken).mockResolvedValue(null);

      await expect(
        service.execute({
          token: 'invalid-token',
          password: 'new-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const expiredDate = new Date();
      expiredDate.setMinutes(expiredDate.getMinutes() - 31);

      vi.mocked(passwordResetRepository.findByToken).mockResolvedValue({
        email: 'test@example.com',
        created_at: expiredDate,
      } as any);

      await expect(
        service.execute({
          token: 'expired-token',
          password: 'new-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      vi.mocked(passwordResetRepository.findByToken).mockResolvedValue({
        email: 'test@example.com',
        created_at: new Date(),
      } as any);
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(
        service.execute({
          token: 'valid-token',
          password: 'new-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
