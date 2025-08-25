import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';


export class UpdateAuthorDto {


   @ApiProperty({ example: 'Jake Paul' })
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({ example: 'Jake Paul is a controversial figure.' })
   @IsString()
   @IsNotEmpty()
   bio: string;

}