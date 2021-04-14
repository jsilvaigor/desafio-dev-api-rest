import { ApiProperty } from '@nestjs/swagger';
import { BankAccountType } from '../model/bankAccount';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BankAccountDto {
  @ApiProperty()
  idAccount: number;

  @ApiProperty()
  balance?: number;

  @ApiProperty()
  dailyWithDrawLimit?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  accountType: string;

  @ApiProperty()
  creationDate?: Date;
}

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  balance: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  dailyWithDrawLimit: number;

  @ApiProperty({ enum: BankAccountType })
  accountType: BankAccountType;
}

export class BalanceDto {
  @ApiProperty()
  balance: number;

  @ApiProperty()
  dailyWithDrawLimit: number;
}

export class TransactionDto {
  @ApiProperty()
  idTransaction: number;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  transactionDate: Date;
  @ApiProperty()
  transactionType: string;
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
