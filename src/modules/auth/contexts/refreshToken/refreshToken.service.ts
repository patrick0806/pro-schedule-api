import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import env from '@config/env';

import { SubscriptionStatus } from '@shared/enums/subscriptionStatus.enum';
import { IRefreshToken } from '@shared/interfaces/tokens.interface';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';
import { UserRepository } from '@shared/repositories/user.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private repository: UserRepository,
    private subscriptionRepository: SubscriptionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify<IRefreshToken>(refreshToken, {
        secret: env().application.jwt.refreshSecret,
      });

      const user = await this.repository.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException({
          error: 'Unauthorized',
          message: 'Invalid refresh token',
        });
      }

      const subscription = await this.subscriptionRepository.findByBusinessId(
        user.business.id,
      );
      const isActive = user.isActive && user.business.isActive;
      if (!isActive) {
        throw new UnauthorizedException({
          error: 'Unauthorized',
          message: 'User or business is not active',
        });
      }

      if (
        subscription.status === SubscriptionStatus.EXPIRED ||
        subscription.status === SubscriptionStatus.INACTIVE
      ) {
        throw new UnauthorizedException({
          error: 'Unauthorized',
          message: 'User or business is not active',
        });
      }

      const newAccessToken = this.jwtService.sign(
        {
          email: user.email,
          businessId: user.business.id,
          planId: subscription.plan.id,
          subscriptionId: subscription.id,
        },
        {
          secret: env().application.jwt.secret,
          expiresIn: env().application.jwt.expiration,
        },
      );

      const newRefreshToken = this.jwtService.sign(
        {
          email: user.email,
        },
        {
          secret: env().application.jwt.refreshSecret,
          expiresIn: env().application.jwt.refreshExpiration,
        },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token',
      });
    }
  }
}
