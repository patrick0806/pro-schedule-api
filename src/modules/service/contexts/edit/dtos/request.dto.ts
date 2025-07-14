import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class EditServiceRequestDTO {
  @ApiProperty({
    example: 'Manicure',
    description: 'The name of the service',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A simple manicure service',
    description: 'The description of the service',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 5000,
    description: 'The price of the service in cents',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 60,
    description: 'The duration of the service in minutes',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  durationInMinutes: number;

  @ApiProperty({
    example: true,
    description: 'Whether the service is active or not',
  })
  @IsBoolean()
  isActive: boolean;
}
