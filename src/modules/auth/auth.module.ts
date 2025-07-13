import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import env from '@config/env';

import { LoginController } from './contexts/login/login.controller';
import { LoginService } from './contexts/login/login.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '@shared/repositories/user.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: env().application.jwt.secret,
      signOptions: { expiresIn: env().application.jwt.expiration },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, UserRepository, JwtStrategy],
})
export class AuthModule { }
