import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAGS } from '@shared/constants';
import { Public } from '@shared/decorators';

import { SignupRequestDTO } from './dtos/request.dto';
import { SignupService } from './signup.service';

@Public()
@ApiTags(API_TAGS.AUTH)
@Controller({ version: '1', path: 'signup' })
export class SignupController {
  constructor(private readonly service: SignupService) {}

  @ApiOperation({ summary: 'Signup' })
  @Post()
  async handle(@Body() signupData: SignupRequestDTO): Promise<void> {
    return await this.service.execute(signupData);
  }
}
