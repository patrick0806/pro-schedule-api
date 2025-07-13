import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';
import { Public } from '@shared/decorators';

import { ResetPasswordRequestDTO } from './dtos/request.dto';
import { ResetPasswordService } from './reset-password.service';

@Public()
@ApiTags(API_TAGS.AUTH)
@Controller({ version: '1', path: 'reset-password' })
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @ApiOperation({ summary: 'Reset Password' })
  @Post()
  async handle(@Body() data: ResetPasswordRequestDTO): Promise<void> {
    return this.resetPasswordService.execute(data);
  }
}
