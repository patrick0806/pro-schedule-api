import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';

import { EmailService } from '@shared/providers';
import { PasswordResetRepository } from '@shared/repositories/password-reset.repository';
import { UserRepository } from '@shared/repositories/user.repository';

import { ForgotPasswordRequestDTO } from './dtos/request.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private userRepository: UserRepository,
    private passwordResetRepository: PasswordResetRepository,
    private emailService: EmailService,
  ) {}

  async execute({ email }: ForgotPasswordRequestDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = randomBytes(32).toString('hex');
    const hashedToken = await hash(token, 10);

    await this.passwordResetRepository.save({
      email,
      token: hashedToken,
    });

    await this.emailService.send(email, 'Password Reset', 'password-reset', {
      token,
    });
  }
}
