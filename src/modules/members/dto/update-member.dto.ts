import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class UpdateMemberDto {

  @ApiProperty({ example: 'Bell Collins' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'bell.collins@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsString()
  @IsNotEmpty()
  joinedDate: string;
}
