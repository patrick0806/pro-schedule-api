import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordRequestDTO {
  @IsEmail()
  @ApiProperty({ example: 'jhondoe@gmail.com' })
  email: string;
}
