import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'some-token' })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'new-password' })
  password: string;
}
