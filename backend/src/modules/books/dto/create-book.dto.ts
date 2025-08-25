import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '76686876786876876' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 1925 })
  @IsInt()
  @IsNotEmpty()
  publishedYear: number;
}