import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class Token {
  @ApiProperty()
  access_token: string;
}
