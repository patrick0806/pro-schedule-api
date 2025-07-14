import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import env from '@config/env';

import { EmailService } from '@shared/providers';
import { BusinessRepository } from '@shared/repositories/business.repository';
import { PasswordResetRepository } from '@shared/repositories/password-reset.repository';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';
import { UserRepository } from '@shared/repositories/user.repository';

import { ForgotPasswordController } from './contexts/forgot-password/forgot-password.controller';
import { ForgotPasswordService } from './contexts/forgot-password/forgot-password.service';
import { LoginController } from './contexts/login/login.controller';
import { LoginService } from './contexts/login/login.service';
import { RefreshTokenController } from './contexts/refreshToken/refreshToken.controller';
import { RefreshTokenService } from './contexts/refreshToken/refreshToken.service';
import { ResetPasswordController } from './contexts/reset-password/reset-password.controller';
import { ResetPasswordService } from './contexts/reset-password/reset-password.service';
import { SignupController } from './contexts/signup/signup.controller';
import { SignupService } from './contexts/signup/signup.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: env().application.jwt.secret,
      signOptions: { expiresIn: env().application.jwt.expiration },
    }),
  ],
  controllers: [
    LoginController,
    RefreshTokenController,
    SignupController,
    ForgotPasswordController,
    ResetPasswordController,
  ],
  providers: [
    LoginService,
    SignupService,
    RefreshTokenService,
    UserRepository,
    BusinessRepository,
    SubscriptionRepository,
    JwtStrategy,
    ForgotPasswordService,
    PasswordResetRepository,
    EmailService,
    ResetPasswordService,
  ],
})
export class AuthModule {}
