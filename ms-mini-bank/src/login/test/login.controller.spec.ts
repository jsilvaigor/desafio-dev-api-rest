import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from '../login.controller';
import { getLoginTestingModule } from './login.utils';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await getLoginTestingModule();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
