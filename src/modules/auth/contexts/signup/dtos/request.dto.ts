import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ name: 'Barber Salon' })
  name: string;

  @IsPhoneNumber('BR')
  @ApiProperty({ name: '11999999999' })
  whatsapp: string;
}

class UserSignup {
  @IsNotEmpty()
  @ApiProperty({ name: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ name: 'johndoe@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ name: '123456' })
  password: string;
}

export class SignupRequestDTO {
  @ApiProperty({ type: BusinessSignup })
  @ValidateNested()
  business: BusinessSignup;

  @ApiProperty({ type: UserSignup })
  @ValidateNested()
  user: UserSignup;

  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  planId: string;
}
