import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmForTest } from '../../test/test.utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from '../../model/bankAccount';
import { AccountTransaction } from '../../model/accountTransaction';
import { BankAccountService } from '../bank-account.service';
import { BankAccountController } from '../bank-account.controller';

export function getBankAccountTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [TypeOrmForTest.getInstance(), TypeOrmModule.forFeature([BankAccount, AccountTransaction])],
    providers: [BankAccountService],
    controllers: [BankAccountController],
  }).compile();
}
