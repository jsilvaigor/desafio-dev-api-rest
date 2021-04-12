import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount, BankAccountType } from '../model/bankAccount';
import { Repository } from 'typeorm';
import { BalanceDto, BankAccountDto, CreateBankAccountDto, TransactionDto } from './bank-account.dto';

@Injectable()
export class BankAccountService {
  constructor(@InjectRepository(BankAccount) private readonly bankAccountRepository: Repository<BankAccount>) {}

  async getAllAccountsForUser(personId: number): Promise<BankAccountDto[]> {
    const allAccounts = await this.bankAccountRepository.find({
      where: { idPerson: personId },
      select: ['accountType', 'idAccount', 'isActive'],
    });
    return allAccounts.map((bankAccount) => {
      return {
        accountType: BankAccountType[bankAccount.accountType],
        idAccount: bankAccount.idAccount,
        isActive: bankAccount.isActive,
      } as BankAccountDto;
    });
  }

  async getAccountInfo(personId: number, accountId: number): Promise<BankAccountDto> {
    const accountInfo = await this.bankAccountRepository.findOne({
      where: {
        idAccount: accountId,
        idPerson: personId,
      },
    });
    if (!accountInfo) {
      throw new NotFoundException();
    }
    return this.getBankAccountDtoFromEntity(accountInfo);
  }

  async createAccount(personId: number, createAccountDto: CreateBankAccountDto): Promise<BankAccountDto> {
    const newAccount = new BankAccount();
    newAccount.accountType = Number(BankAccountType[createAccountDto.accountType]);
    newAccount.idPerson = personId;
    newAccount.balance = createAccountDto.balance;
    newAccount.dailyWithdrawLimit = createAccountDto.dailyWithDrawLimit;
    const savedAccount = await this.bankAccountRepository.save(newAccount);
    return this.getBankAccountDtoFromEntity(savedAccount);
  }

  async getAccountBalance(personId: number, accountId: number): Promise<BalanceDto> {
    const { balance, dailyWithDrawLimit } = await this.getAccountInfo(personId, accountId);
    return {
      balance,
      dailyWithDrawLimit,
    } as BalanceDto;
  }

  async changeAccountStatus(personId: number, accountId: number, status: boolean): Promise<boolean> {
    const updateResult = await this.bankAccountRepository.update(
      {
        idPerson: personId,
        idAccount: accountId,
      },
      { isActive: status },
    );
    if (updateResult.affected === 0) {
      throw new NotFoundException();
    }
    return true;
  }

  async getAccountTransactions(personId: number, accountId: number): Promise<TransactionDto[]> {
    const accountInfo = await this.bankAccountRepository.findOne({
      where: {
        idAccount: accountId,
        idPerson: personId,
      },
      relations: ['accountTransactions'],
    });
    if (!accountInfo) {
      throw new NotFoundException();
    }
    return accountInfo.accountTransactions.map((transaction) => {
      return {
        idTransaction: transaction.idTransaction,
        transactionDate: transaction.transactionDate,
        amount: transaction.amount,
      } as TransactionDto;
    });
  }

  private getBankAccountDtoFromEntity(bankAccount: BankAccount): BankAccountDto {
    return {
      accountType: BankAccountType[bankAccount.accountType],
      balance: bankAccount.balance,
      dailyWithDrawLimit: bankAccount.dailyWithdrawLimit,
      idAccount: bankAccount.idAccount,
      isActive: bankAccount.isActive,
      creationDate: bankAccount.creationDate,
    } as BankAccountDto;
  }
}
