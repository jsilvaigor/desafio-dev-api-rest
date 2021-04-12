import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountController } from '../bank-account.controller';
import { getBankAccountTestingModule } from './bank-account.utils';

describe('BankAccountController', () => {
  let controller: BankAccountController;

  beforeEach(async () => {
    const module: TestingModule = await getBankAccountTestingModule();

    controller = module.get<BankAccountController>(BankAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
