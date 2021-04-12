import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount, BankAccountType } from '../model/bankAccount';
import { Between, getManager, LessThanOrEqual, MoreThanOrEqual, QueryBuilder, Repository } from 'typeorm';
import {
  BalanceDto,
  BankAccountDto,
  CreateBankAccountDto,
  CreateTransactionDto,
  TransactionDto,
} from './bank-account.dto';
import { AccountTransaction } from '../model/accountTransaction';
import * as moment from 'moment';

export interface DateFilter {
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount) private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(AccountTransaction) private readonly accountTransactionRepository: Repository<AccountTransaction>,
  ) {}

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
    const accountInfo = await this.getRawAccountInfo(personId, accountId);
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

  async getAccountTransactions(personId: number, accountId: number, filter: DateFilter): Promise<TransactionDto[]> {
    const accountInfo = await this.bankAccountRepository.findOne({
      join: { alias: 'account', innerJoin: { transactions: 'account.accountTransactions' } },
      where: (qb) => {
        qb.where({
          idAccount: accountId,
          idPerson: personId,
        }).andWhere(...this.createDateFilter(filter));
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

  async createDepositTransaction(
    personId: number,
    accountId: number,
    transactionDto: CreateTransactionDto,
  ): Promise<BalanceDto> {
    if (transactionDto.amount <= 0) {
      throw new BadRequestException('Invalid amount value');
    }
    const accountInfo = await this.getRawAccountInfo(personId, accountId);
    if (!accountInfo.isActive) {
      throw new BadRequestException('Transactions on inactive accounts are forbidden');
    }
    const transaction = new AccountTransaction();
    transaction.amount = transactionDto.amount;
    transaction.idAccount = accountInfo.idAccount;

    // Update balance
    accountInfo.balance = accountInfo.balance + transactionDto.amount;
    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(transaction);
      await transactionalEntityManager.save(accountInfo);
    });

    return {
      balance: accountInfo.balance,
      dailyWithDrawLimit: accountInfo.dailyWithdrawLimit,
    } as BalanceDto;
  }

  async createWithdrawTransaction(
    personId: number,
    accountId: number,
    transactionDto: CreateTransactionDto,
  ): Promise<BalanceDto> {
    if (transactionDto.amount <= 0) {
      throw new BadRequestException('Invalid amount value');
    }
    const accountInfo = await this.getRawAccountInfo(personId, accountId);
    if (!accountInfo.isActive) {
      throw new BadRequestException('Transactions on inactive accounts are forbidden');
    }
    if (transactionDto.amount > accountInfo.dailyWithdrawLimit) {
      throw new BadRequestException('Requested withdraw value exceeds the daily limit.');
    }
    if (transactionDto.amount > accountInfo.balance) {
      throw new BadRequestException('Requested withdraw value exceeds your balance.');
    }
    const transactions = await this.accountTransactionRepository.find({
      where: {
        idAccount: accountId,
        transactionDate: MoreThanOrEqual(moment().startOf('day').toISOString()),
      },
    });
    if (!!transactions) {
      const dailyTotal = transactions.reduce((acc, transaction) => acc + Number(transaction.amount), 0);
      if (dailyTotal >= accountInfo.dailyWithdrawLimit) {
        throw new BadRequestException('Daily withdraw limit reached. Try again tomorrow');
      }
      if (dailyTotal + transactionDto.amount > accountInfo.dailyWithdrawLimit) {
        throw new BadRequestException('The amount requested will exceed the daily limit.');
      }
    }
    const transaction = new AccountTransaction();
    transaction.amount = transactionDto.amount;
    transaction.idAccount = accountInfo.idAccount;

    // Update balance
    accountInfo.balance = accountInfo.balance - transactionDto.amount;
    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(transaction);
      await transactionalEntityManager.save(accountInfo);
    });

    return {
      balance: accountInfo.balance,
      dailyWithDrawLimit: accountInfo.dailyWithdrawLimit,
    } as BalanceDto;
  }

  private async getRawAccountInfo(personId: number, accountId: number): Promise<BankAccount> {
    const accountInfo = await this.bankAccountRepository.findOne({
      where: {
        idAccount: accountId,
        idPerson: personId,
      },
    });
    if (!accountInfo) {
      throw new NotFoundException();
    }
    return accountInfo;
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

  createDateFilter({ startDate, endDate }: DateFilter) {
    const from = moment(startDate).startOf('day').toISOString();
    const to = moment(endDate).endOf('day').toISOString();
    if (!!startDate && !!endDate) {
      return ['transactions.dataTransacao BETWEEN :from AND :to', { from, to }];
    } else if (!!startDate) {
      return ['transactions.dataTransacao >= :from ', { from }];
    } else if (!!endDate) {
      return ['transactions.dataTransacao <= :to ', { to }];
    }

    // FIXME: Remove this hack. Inspiration https://github.com/typeorm/typeorm/issues/3103#issuecomment-490805889
    return ['1=1'];
  }
}
