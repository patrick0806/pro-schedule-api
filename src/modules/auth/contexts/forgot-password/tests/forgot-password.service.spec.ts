import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailService } from '@shared/providers';
import { PasswordResetRepository } from '@shared/repositories/password-reset.repository';
import { UserRepository } from '@shared/repositories/user.repository';

import { ForgotPasswordService } from '../forgot-password.service';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-token'),
}));

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let userRepository: UserRepository;
  let passwordResetRepository: PasswordResetRepository;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: vi.fn(),
          },
        },
        {
          provide: PasswordResetRepository,
          useValue: {
            save: vi.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            send: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
    userRepository = module.get<UserRepository>(UserRepository);
    passwordResetRepository = module.get<PasswordResetRepository>(
      PasswordResetRepository,
    );
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should send a password reset email when user exists', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({} as any);

      await service.execute({ email: 'test@example.com' });

      expect(passwordResetRepository.save).toHaveBeenCalled();
      expect(emailService.send).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(
        service.execute({ email: 'nonexistent@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
