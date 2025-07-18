import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { randomUUID } from 'node:crypto';

class BusinessSignup {
  @IsNotEmpty()
  @ApiProperty({ example: 'Barber Salon' })
  name: string;

  @IsPhoneNumber('BR')
  @ApiProperty({ example: '11999999999' })
  whatsapp: string;
}

class UserSignup {
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;
}

export class SignupRequestDTO {
  @ApiProperty({ type: BusinessSignup })
  @ValidateNested()
  @Type(() => BusinessSignup)
  business: BusinessSignup;

  @ApiProperty({ type: UserSignup })
  @ValidateNested()
  @Type(() => UserSignup)
  user: UserSignup;

  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  planId: string;
}
