import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginRequestDTO } from './dtos/request.dto';
import { UserRepository } from '@shared/repositories/user.repository';
import e from 'express';
import { compareHash } from '@shared/utils/hash.util';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';
import { SubscriptionStatus } from '@shared/enums/subscriptionStatus.enum';
import { JwtService } from '@nestjs/jwt';
import env from '@config/env';
import { IAccessToken } from '@shared/interfaces/tokens.interface';

@Injectable()
export class LoginService {
  constructor(
    private repository: UserRepository,
    private subscriptionRepository: SubscriptionRepository,
    private jwtService: JwtService
  ) { }

  async execute({ email, password }: LoginRequestDTO): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'Invalid credentials, check your email and password',
      });
    }

    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'Invalid credentials, check your email and password',
      });
    }

    const subscription = await this.subscriptionRepository.findByBusinessId(user.business.id);
    const isActive = user.isActive && user.business.isActive;
    if (!isActive) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'User or business is not active',
      });
    }

    if (subscription.status === SubscriptionStatus.EXPIRED || subscription.status === SubscriptionStatus.INACTIVE) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'User or business is not active',
      });
    }

    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        businessId: user.business.id,
        planId: subscription.plan.id,
        subscriptionId: subscription.id,
      },
      {
        secret: env().application.jwt.secret,
        expiresIn: env().application.jwt.expiration
      }
    );

    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
      },
      {
        secret: env().application.jwt.refreshSecret,
        expiresIn: env().application.jwt.refreshExpiration,
      }
    );

    return {
      accessToken,
      refreshToken,
    }
  }
}
