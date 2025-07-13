import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { addMinutes } from 'date-fns';

import { PasswordResetRepository } from '@shared/repositories/password-reset.repository';
import { UserRepository } from '@shared/repositories/user.repository';

import { ResetPasswordRequestDTO } from './dtos/request.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private passwordResetRepository: PasswordResetRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({ token, password }: ResetPasswordRequestDTO): Promise<void> {
    const passwordReset = await this.passwordResetRepository.findByToken(token);

    if (!passwordReset) {
      throw new UnauthorizedException('Invalid token');
    }

    const isTokenExpired = addMinutes(passwordReset.created_at, 30) < new Date();

    if (isTokenExpired) {
      throw new UnauthorizedException('Expired token');
    }

    const user = await this.userRepository.findByEmail(passwordReset.email);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    user.password = password;

    await this.userRepository.save(user);

    await this.passwordResetRepository.delete({ email: user.email });
  }
}
