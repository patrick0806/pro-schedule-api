import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignupService } from '../signup.service';
import { UserRepository } from '@shared/repositories/user.repository';
import { BusinessRepository } from '@shared/repositories/business.repository';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';
import { EmailService } from '@shared/providers';
import { SignupRequestDTO } from '../dtos/request.dto';
import { SubscriptionStatus } from '@shared/enums/subscriptionStatus.enum';
import { addDays } from 'date-fns';

vi.mock('date-fns', () => ({
  addDays: vi.fn(() => new Date('2024-01-15T00:00:00.000Z')),
}));

describe('SignupService', () => {
  let service: SignupService;
  let userRepository: UserRepository;
  let businessRepository: BusinessRepository;
  let subscriptionRepository: SubscriptionRepository;
  let emailService: EmailService;

  const mockSignupRequest: SignupRequestDTO = {
    business: {
      name: 'Test Business',
      whatsapp: '5511999999999',
    },
    user: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    },
    planId: 'some-plan-id',
  };

  const mockSavedBusiness = {
    id: 'business-id',
    name: 'Test Business',
    whatsapp: '5511999999999',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: BusinessRepository,
          useValue: {
            findByPhoneNumber: vi.fn(),
            save: vi.fn(() => mockSavedBusiness),
          },
        },
        {
          provide: SubscriptionRepository,
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

    service = module.get<SignupService>(SignupService);
    userRepository = module.get<UserRepository>(UserRepository);
    businessRepository = module.get<BusinessRepository>(BusinessRepository);
    subscriptionRepository = module.get<SubscriptionRepository>(SubscriptionRepository);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should successfully sign up a new user and business', async () => {
      vi.mocked(businessRepository.findByPhoneNumber).mockResolvedValue(null);
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await service.execute(mockSignupRequest);

      expect(businessRepository.findByPhoneNumber).toHaveBeenCalledWith(mockSignupRequest.business.whatsapp);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockSignupRequest.user.email);
      expect(businessRepository.save).toHaveBeenCalledWith({
        ...mockSignupRequest.business,
        whatsapp: '5511999999999',
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockSignupRequest.user,
        business: mockSavedBusiness,
      });
      expect(subscriptionRepository.save).toHaveBeenCalledWith({
        business: mockSavedBusiness,
        plan: { id: mockSignupRequest.planId },
        status: SubscriptionStatus.TRIAL,
        renewsAt: new Date('2024-01-15T00:00:00.000Z'),
      });
      expect(emailService.send).toHaveBeenCalledWith(
        mockSignupRequest.user.email,
        'Bem vindo ao Pro schedule',
        'welcome',
        {
          name: mockSignupRequest.user.name,
          businessName: mockSignupRequest.business.name,
        },
      );
    });

    it('should throw ConflictException if business phone number already exists', async () => {
      vi.mocked(businessRepository.findByPhoneNumber).mockResolvedValue(mockSavedBusiness as any);

      await expect(service.execute(mockSignupRequest)).rejects.toThrow(ConflictException);
      await expect(service.execute(mockSignupRequest)).rejects.toThrow('Already exists a Business with this whatsapp');
    });

    it('should throw ConflictException if user email already exists', async () => {
      vi.mocked(businessRepository.findByPhoneNumber).mockResolvedValue(null);
      vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: 'user-id' } as any);

      await expect(service.execute(mockSignupRequest)).rejects.toThrow(ConflictException);
      await expect(service.execute(mockSignupRequest)).rejects.toThrow('Already exists a User with this email');
    });
  });
});