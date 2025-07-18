import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';

import { API_TAGS, HEADERS } from '@shared/constants';
import { Public } from '@shared/decorators';

import { LoginRequestDTO } from './dtos/request.dto';
import { LoginService } from './login.service';

@Public()
@ApiTags(API_TAGS.AUTH)
@Controller({ version: '1', path: 'login' })
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiOperation({ summary: 'Login' })
  @Post()
  async handle(
    @Body() loginData: LoginRequestDTO,
    @Res() res: FastifyReply,
  ): Promise<any> {
    const response = await this.loginService.execute(loginData);
    res.header(HEADERS.ACCESS_TOKEN, `${response.accessToken}`);
    res.header(HEADERS.REFRESH_TOKEN, `${response.refreshToken}`);
    return res.send();
  }
}
