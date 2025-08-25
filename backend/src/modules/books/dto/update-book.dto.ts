import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '340525' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 1925 })
  @IsInt()
  @IsNotEmpty()
  publishedYear: number;
}