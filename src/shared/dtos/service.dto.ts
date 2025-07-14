import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class ServiceDTO {
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({
    example: 'Manicure',
    description: 'The name of the service',
  })
  name: string;

  @ApiProperty({
    example: 'A simple manicure service',
    description: 'The description of the service',
  })
  description: string;

  @ApiProperty({
    example: 5000,
    description: 'The price of the service in cents',
  })
  price: string;

  @ApiProperty({
    example: 60,
    description: 'The duration of the service in minutes',
  })
  durationInMinutes: number;

  @ApiProperty({
    example: true,
    description: 'Whether the service is active or not',
  })
  isActive: boolean;
}
