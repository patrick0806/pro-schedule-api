import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenRequestDTO {
    @IsString()
    @ApiProperty({ example: 'someRefreshToken' })
    refreshToken: string;
}