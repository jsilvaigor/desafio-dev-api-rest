import { TestingModule } from '@nestjs/testing';
import { BankAccountController } from '../bank-account.controller';
import { getBankAccountTestingModule } from './bank-account.utils';
import { Person } from '../../model/person';
import { TestUtils } from '../../test/test.utils';
import { BankAccountDto, CreateBankAccountDto, CreateTransactionDto, TransactionDto } from '../bank-account.dto';
import { BankAccountType } from '../../model/bankAccount';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';

describe('BankAccountController', () => {
  let controller: BankAccountController;
  let person: Person;
  let account: BankAccountDto;

  beforeAll(async () => {
    person = await TestUtils.getTestPerson();
  });

  beforeEach(async () => {
    const module: TestingModule = await getBankAccountTestingModule();

    controller = module.get<BankAccountController>(BankAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array', async () => {
    await expect(controller.getAllAccounts(person.idPerson)).resolves.toBeInstanceOf(Array);
  });

  it('should create a new account', async () => {
    const createAccountDto = new CreateBankAccountDto();
    createAccountDto.accountType = BankAccountType.CheckingAccount;
    createAccountDto.balance = 100.0;
    createAccountDto.dailyWithDrawLimit = 1000.0;
    const created = await controller.createAccount(person.idPerson, createAccountDto);
    expect(created).toBeDefined();
    // saving for later use
    account = created;
    expect(created.accountType).toEqual(BankAccountType[createAccountDto.accountType]);
    expect(created.balance).toEqual(createAccountDto.balance);
    expect(created.dailyWithDrawLimit).toEqual(createAccountDto.dailyWithDrawLimit);
  });

  it('should return the account information', async () => {
    const accountInfo = await controller.getAccountInfo(person.idPerson, account.idAccount);
    expect(accountInfo.idAccount).toEqual(account.idAccount);
    expect(accountInfo.accountType).toEqual(account.accountType);
    expect(accountInfo.isActive).toBeTruthy();
    //updating account
    account.isActive = accountInfo.isActive;
    expect(accountInfo.balance).toBe(account.balance);
    expect(accountInfo.dailyWithDrawLimit).toBe(accountInfo.dailyWithDrawLimit);
  });

  it('should throw a NotFoundException when a unknown account is provided', async () => {
    await expect(controller.getAccountInfo(person.idPerson, 9999)).rejects.toThrow(new NotFoundException());
  });

  it('should return the account balance', async () => {
    const balance = await controller.getAccountBalance(person.idPerson, account.idAccount);
    expect(balance).toBeDefined();
    expect(balance.balance).toBe(account.balance);
    expect(balance.dailyWithDrawLimit).toBe(account.dailyWithDrawLimit);
  });

  it('should block the account', async () => {
    const blocked = await controller.patchBlockAccount(person.idPerson, account.idAccount);
    expect(blocked).toBeTruthy();
    const accountInfo = await controller.getAccountInfo(person.idPerson, account.idAccount);
    expect(accountInfo.isActive).toBeFalsy();
  });

  it('should throw a NotFoundException when blocking a unknown account', async () => {
    await expect(controller.patchBlockAccount(person.idPerson, 9999)).rejects.toThrow(new NotFoundException());
  });

  it('should throw a BadRequest when trying to deposit on a inactive account', async () => {
    await expect(
      controller.createDepositTransaction(person.idPerson, account.idAccount, { amount: 100 }),
    ).rejects.toThrow(new BadRequestException('Transactions on inactive accounts are forbidden'));
  });

  it('should throw a BadRequest when trying to withdraw on a inactive account', async () => {
    await expect(
      controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: 100 }),
    ).rejects.toThrow(new BadRequestException('Transactions on inactive accounts are forbidden'));
  });

  it('should unblock the account', async () => {
    const unblocked = await controller.patchUnBlockAccount(person.idPerson, account.idAccount);
    expect(unblocked).toBeTruthy();
    const accountInfo = await controller.getAccountInfo(person.idPerson, account.idAccount);
    expect(accountInfo.isActive).toBeTruthy();
  });

  it('should create a deposit transaction and return the updated balance', async () => {
    const deposit: CreateTransactionDto = {
      amount: 2000,
    };
    const created = await controller.createDepositTransaction(person.idPerson, account.idAccount, deposit);
    expect(created).toBeDefined();
    account.balance += 2000;
    expect(created.balance).toBe(account.balance);
  });

  it('should throw a BadRequest when the deposit amount is invalid', async () => {
    await expect(
      controller.createDepositTransaction(person.idPerson, account.idAccount, { amount: -100 }),
    ).rejects.toThrow(new BadRequestException('Invalid amount value'));
  });

  it('should create a withdraw transaction and return the updated balance', async () => {
    const withdraw: CreateTransactionDto = {
      amount: 100,
    };
    const created = await controller.createWithdrawTransaction(person.idPerson, account.idAccount, withdraw);
    expect(created).toBeDefined();
    account.balance -= 100;
    expect(created.balance).toBe(account.balance);
  });

  it('should throw a BadRequest when the withdraw amount is invalid', async () => {
    await expect(
      controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: -100 }),
    ).rejects.toThrow(new BadRequestException('Invalid amount value'));
  });

  it('should throw a BadRequest when the withdraw amount is bigger than dailyLimit', async () => {
    await expect(
      controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: 2000 }),
    ).rejects.toThrow(new BadRequestException('Requested withdraw value exceeds the daily limit.'));
  });

  it('should throw a BadRequest when the withdraw amount is bigger than balance', async () => {
    await expect(
      controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: 5000 }),
    ).rejects.toThrow(new BadRequestException('Requested withdraw value exceeds your balance.'));
  });

  it('should throw a BadRequest when the withdraw amount + sum(transactions) is bigger than dailyLimit', async () => {
    await expect(
      controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: 901 }),
    ).rejects.toThrow(new BadRequestException('The amount requested will exceed the daily limit.'));
  });

  it('should throw a BadRequest when dailyLimit reached', async () => {
    const withdraw = await controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: 900 });
    expect(withdraw).toBeTruthy();
    await expect(
      controller.createWithdrawTransaction(person.idPerson, account.idAccount, { amount: 1 }),
    ).rejects.toThrow(new BadRequestException('Daily withdraw limit reached. Try again tomorrow'));
  });

  it('should return all successful transactions', async () => {
    const transactions = await controller.getAllTransactions(person.idPerson, account.idAccount);
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(3);
  });

  it('should throw a NotFoundException when getting all transactions of a unknown account', async () => {
    await expect(controller.getAllTransactions(person.idPerson, 9999)).rejects.toThrow(new NotFoundException());
  });

  it('should return all transactions from today passing startDate', async () => {
    const transactions = await controller.getAllTransactions(person.idPerson, account.idAccount, moment().toDate());
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(3);
  });

  it('should return all transactions until today passing endDate', async () => {
    const transactions = await controller.getAllTransactions(
      person.idPerson,
      account.idAccount,
      null,
      moment().toDate(),
    );
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(3);
  });
  it('should return all transactions from today passing startDate = yesterday & endDate = tomorrow', async () => {
    const transactions = await controller.getAllTransactions(
      person.idPerson,
      account.idAccount,
      moment().subtract(1, 'd').toDate(),
      moment().add(1, 'd').toDate(),
    );
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(3);
  });
  it('should throw a NotFoundException passing startDate & endDate', async () => {
    const transactions = controller.getAllTransactions(
      person.idPerson,
      account.idAccount,
      moment().subtract(15, 'd').toDate(),
      moment().subtract(10, 'd').toDate(),
    );
    await expect(transactions).rejects.toThrow(new NotFoundException());
  });
});
