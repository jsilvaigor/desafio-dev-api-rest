import { TestingModule } from '@nestjs/testing';
import { LoginController } from '../login.controller';
import { getLoginTestingModule, getPersonCpfToLogin } from './login.utils';
import { LoginDto, Token } from '../login.dto';
import * as jwt from 'jsonwebtoken';
import envVars from '../../utils/environ';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../jwt.strategy';

describe('LoginController', () => {
  let controller: LoginController;
  let personCpf: string;

  beforeAll(async () => {
    personCpf = await getPersonCpfToLogin();
  });

  beforeEach(async () => {
    const module: TestingModule = await getLoginTestingModule();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login successfully', async () => {
    const logindto: LoginDto = {
      cpf: personCpf,
      password: 'simple123',
    };
    const token = await controller.doLogin(logindto);
    expect(token).toBeDefined();
    expect(token.access_token).toBeDefined();
    expect(token.access_token).toBeTruthy();
    expect(jwt.verify(token.access_token, envVars.JWT_SECRET)).toBeTruthy();
  });

  it('should throw unauthorized', async () => {
    const logindto: LoginDto = {
      cpf: personCpf,
      password: 'wrongPass',
    };
    const login = controller.doLogin(logindto);
    await expect(login).rejects.toThrow(new UnauthorizedException());
  });
});
