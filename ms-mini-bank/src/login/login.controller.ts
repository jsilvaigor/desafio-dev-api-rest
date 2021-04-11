import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto, Token } from './login.dto';

@Controller('login')
@ApiTags('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Do login with a existent user', type: Token })
  @ApiUnauthorizedResponse({ description: 'Wrong cpf or password' })
  doLogin(@Body() loginDto: LoginDto): Promise<Token> {
    return this.loginService.doLogin(loginDto);
  }
}
