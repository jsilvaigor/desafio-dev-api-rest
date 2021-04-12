/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from '../model/bankAccount';
import { AccountTransaction } from '../model/accountTransaction';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount, AccountTransaction])],
  providers: [BankAccountService],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
