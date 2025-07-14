import { ApiProperty } from '@nestjs/swagger';

export class PageDTO<T> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  size: number;

  @ApiProperty({ example: 100 })
  totalElements: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty()
  content: T[];
}
