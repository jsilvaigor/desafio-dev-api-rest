import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from '../model/bankAccount';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  providers: [BankAccountService],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
