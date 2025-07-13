import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';
import { Public } from '@shared/decorators';

import { ForgotPasswordRequestDTO } from './dtos/request.dto';
import { ForgotPasswordService } from './forgot-password.service';

@Public()
@ApiTags(API_TAGS.AUTH)
@Controller({ version: '1', path: 'forgot-password' })
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @ApiOperation({ summary: 'Forgot Password' })
  @Post()
  async handle(@Body() { email }: ForgotPasswordRequestDTO): Promise<void> {
    return this.forgotPasswordService.execute({ email });
  }
}
