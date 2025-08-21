import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';


export class CreateAuthorDto {

   @ApiProperty({ example: 1 })
   @IsInt()
   @IsNotEmpty()
   id: number;

   @ApiProperty({ example: 'Donald Trump' })
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({ example: 'Donald Trump is a great author.' })
   @IsString()
   @IsNotEmpty()
   bio: string;

}