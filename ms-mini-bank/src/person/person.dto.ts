import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  cpf: string;
  @ApiProperty()
  birthDate?: Date;
}

export class PersonCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
