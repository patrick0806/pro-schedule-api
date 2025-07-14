import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SubscriptionStatus } from '@shared/enums/subscriptionStatus.enum';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';
import { UserRepository } from '@shared/repositories/user.repository';
import { compareHash } from '@shared/utils/hash.util';

import { LoginService } from '../login.service';

vi.mock('@shared/utils/hash.util');
vi.mock('@config/env', () => ({
  default: () => ({
    application: {
      jwt: {
        secret: 'test-secret',
        expiration: '1h',
        refreshSecret: 'test-refresh-secret',
        refreshExpiration: '7d',
      },
    },
  }),
}));

describe('LoginService', () => {
  let service: LoginService;
  let userRepository: UserRepository;
  let subscriptionRepository: SubscriptionRepository;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    isActive: true,
    business: {
      id: '1',
      isActive: true,
    },
  };

  const mockSubscription = {
    id: '1',
    status: SubscriptionStatus.ACTIVE,
    plan: {
      id: '1',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: vi.fn(),
          },
        },
        {
          provide: SubscriptionRepository,
          useValue: {
            findByBusinessId: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    userRepository = module.get<UserRepository>(UserRepository);
    subscriptionRepository = module.get<SubscriptionRepository>(
      SubscriptionRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should successfully authenticate user and return tokens', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(
        mockSubscription as any,
      );
      vi.mocked(compareHash).mockResolvedValue(true);

      const result = await service.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(
        service.execute({
          email: 'nonexistent@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(compareHash).mockResolvedValue(false);

      await expect(
        service.execute({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(
        inactiveUser as any,
      );
      vi.mocked(compareHash).mockResolvedValue(true);
      vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(
        mockSubscription as any,
      );

      await expect(
        service.execute({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when business is inactive', async () => {
      const userWithInactiveBusiness = {
        ...mockUser,
        business: { ...mockUser.business, isActive: false },
      };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(
        userWithInactiveBusiness as any,
      );
      vi.mocked(compareHash).mockResolvedValue(true);
      vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(
        mockSubscription as any,
      );

      await expect(
        service.execute({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when subscription is expired', async () => {
      const expiredSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.EXPIRED,
      };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(compareHash).mockResolvedValue(true);
      vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(
        expiredSubscription as any,
      );

      await expect(
        service.execute({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when subscription is inactive', async () => {
      const inactiveSubscription = {
        ...mockSubscription,
        status: SubscriptionStatus.INACTIVE,
      };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(compareHash).mockResolvedValue(true);
      vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(
        inactiveSubscription as any,
      );

      await expect(
        service.execute({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
