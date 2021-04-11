import { ApiProperty } from '@nestjs/swagger';
import { BankAccountType } from '../model/bankAccount';

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
  balance: number;

  @ApiProperty()
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
