import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';

import { API_TAGS, HEADERS } from '@shared/constants';
import { Public } from '@shared/decorators';
import { RefreshTokenService } from './refreshToken.service';

@Public()
@ApiTags(API_TAGS.AUTH)
@Controller({ version: '1', path: 'refresh' })
export class RefreshTokenController {
    constructor(private readonly service: RefreshTokenService) { }

    @ApiOperation({ summary: 'Refresh Token' })
    @Post('refresh')
    async handle(@Headers(HEADERS.REFRESH_TOKEN) refreshToken: string, @Res() res: FastifyReply): Promise<any> {
        const response = await this.service.execute(refreshToken);
        res.header(HEADERS.ACCESS_TOKEN, `Bearer ${response.accessToken}`);
        res.header(HEADERS.REFRESH_TOKEN, `Bearer ${response.refreshToken}`);
        return res.send();
    }
}
