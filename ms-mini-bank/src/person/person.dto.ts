import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCpf } from '../utils/validation.utils';

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
  @IsCpf()
  cpf: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
