import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateMemberDto {

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsString()
  @IsNotEmpty()
  joinedDate: string;
}