import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountService } from '../bank-account.service';
import { getBankAccountTestingModule } from './bank-account.utils';

describe('BankAccountService', () => {
  let service: BankAccountService;

  beforeEach(async () => {
    const module: TestingModule = await getBankAccountTestingModule();

    service = module.get<BankAccountService>(BankAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
