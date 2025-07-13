import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import env from '@config/env';

import { LoginController } from './contexts/login/login.controller';
import { LoginService } from './contexts/login/login.service';
import { ForgotPasswordController } from './contexts/forgot-password/forgot-password.controller';
import { ForgotPasswordService } from './contexts/forgot-password/forgot-password.service';
import { ResetPasswordController } from './contexts/reset-password/reset-password.controller';
import { ResetPasswordService } from './contexts/reset-password/reset-password.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '@shared/repositories/user.repository';
import { PasswordResetRepository } from '@shared/repositories/password-reset.repository';
import { EmailService } from '@shared/providers';
import { SignupService } from './contexts/signup/signup.service';
import { SignupController } from './contexts/signup/signup.controller';
import { RefreshTokenController } from './contexts/refreshToken/refreshToken.controller';
import { RefreshTokenService } from './contexts/refreshToken/refreshToken.service';
import { BusinessRepository } from '@shared/repositories/business.repository';
import { SubscriptionRepository } from '@shared/repositories/subscription.repository';

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
export class AuthModule { }

