import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@shared/repositories/user.repository';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';
import { SubscriptionStatus } from '@shared/enums/subscriptionStatus.enum';
import { compareHash } from '@shared/utils/hash.util';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenService } from '../refreshToken.service';

vi.mock('@shared/utils/hash.util');
vi.mock('jsonwebtoken', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        verify: vi.fn(),
    };
});
vi.mock('@config/env', () => ({
    default: () => ({
        application: {
            jwt: {
                secret: 'test-secret',
                expiration: '1h',
                refreshSecret: 'test-refresh-secret',
                refreshExpiration: '7d'
            }
        }
    })
}));

describe('RefreshTokenService', () => {
    let service: RefreshTokenService;
    let userRepository: UserRepository;
    let subscriptionRepository: SubscriptionRepository;
    let jwtService: JwtService;

    const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
        business: {
            id: '1',
            isActive: true
        }
    };

    const mockSubscription = {
        id: '1',
        status: SubscriptionStatus.ACTIVE,
        plan: {
            id: '1'
        }
    };

    const mockDecodedRefreshToken = {
        email: 'test@example.com',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefreshTokenService,
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

        service = module.get<RefreshTokenService>(RefreshTokenService);
        userRepository = module.get<UserRepository>(UserRepository);
        subscriptionRepository = module.get<SubscriptionRepository>(SubscriptionRepository);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        /*   it('should successfully refresh tokens', async () => {
              vi.mocked(jwt.verify).mockReturnValue(mockDecodedRefreshToken as any);
              vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
              vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(mockSubscription as any);
              vi.mocked(jwtService.sign).mockReturnValue('new-token');
  
              const result = await service.execute('valid-refresh-token');
  
              expect(result).toEqual({
                  accessToken: 'new-token',
                  refreshToken: 'new-token',
              });
              expect(jwt.verify).toHaveBeenCalledWith('valid-refresh-token', {
                  secret: 'test-refresh-secret',
              });
              expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
              expect(subscriptionRepository.findByBusinessId).toHaveBeenCalledWith(mockUser.business.id);
              expect(jwtService.sign).toHaveBeenCalledTimes(2);
          }); */

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error('invalid token');
            });

            await expect(service.execute('invalid-token')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user not found during refresh', async () => {
            vi.mocked(jwt.verify).mockReturnValue(mockDecodedRefreshToken as any);
            vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

            await expect(service.execute('valid-refresh-token')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user is inactive during refresh', async () => {
            const inactiveUser = { ...mockUser, isActive: false };
            vi.mocked(jwt.verify).mockReturnValue(mockDecodedRefreshToken as any);
            vi.mocked(userRepository.findByEmail).mockResolvedValue(inactiveUser as any);
            vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(mockSubscription as any);

            await expect(service.execute('valid-refresh-token')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if business is inactive during refresh', async () => {
            const userWithInactiveBusiness = {
                ...mockUser,
                business: { ...mockUser.business, isActive: false }
            };
            vi.mocked(jwt.verify).mockReturnValue(mockDecodedRefreshToken as any);
            vi.mocked(userRepository.findByEmail).mockResolvedValue(userWithInactiveBusiness as any);
            vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(mockSubscription as any);

            await expect(service.execute('valid-refresh-token')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if subscription is expired during refresh', async () => {
            const expiredSubscription = { ...mockSubscription, status: SubscriptionStatus.EXPIRED };
            vi.mocked(jwt.verify).mockReturnValue(mockDecodedRefreshToken as any);
            vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
            vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(expiredSubscription as any);

            await expect(service.execute('valid-refresh-token')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if subscription is inactive during refresh', async () => {
            const inactiveSubscription = { ...mockSubscription, status: SubscriptionStatus.INACTIVE };
            vi.mocked(jwt.verify).mockReturnValue(mockDecodedRefreshToken as any);
            vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
            vi.mocked(subscriptionRepository.findByBusinessId).mockResolvedValue(inactiveSubscription as any);

            await expect(service.execute('valid-refresh-token')).rejects.toThrow(UnauthorizedException);
        });
    });
});