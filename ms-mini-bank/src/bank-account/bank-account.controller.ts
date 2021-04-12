import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import {
  BalanceDto,
  BankAccountDto,
  CreateBankAccountDto,
  CreateTransactionDto,
  TransactionDto,
} from './bank-account.dto';
import { JwtAuthGuard } from '../login/jwt.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidatePersonId } from '../login/secondLevel.guard';

@Controller('person/:person_id/bank-account')
@UseGuards(JwtAuthGuard, ValidatePersonId)
@ApiBearerAuth()
@ApiTags('bankAccount')
@ApiUnauthorizedResponse({ description: 'Auth token is required' })
@ApiForbiddenResponse({ description: "Oops! You don't have permission to see this information." })
@ApiNotFoundResponse({ description: 'Nothing to see here' })
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get()
  @ApiOkResponse({ description: 'All bank accounts for the user', type: [BankAccountDto] })
  getAllAccounts(@Param('person_id') personId: number): Promise<BankAccountDto[]> {
    return this.bankAccountService.getAllAccountsForUser(personId);
  }

  @Get(':account_id')
  @ApiOkResponse({ description: 'Account details', type: BankAccountDto })
  getAccountInfo(
    @Param('person_id') personId: number,
    @Param('account_id') accountId: number,
  ): Promise<BankAccountDto> {
    return this.bankAccountService.getAccountInfo(personId, accountId);
  }

  @Get(':account_id/balance')
  @ApiOkResponse({ description: 'Account balance', type: BalanceDto })
  getAccountBalance(@Param('person_id') personId: number, @Param('account_id') accountId: number): Promise<BalanceDto> {
    return this.bankAccountService.getAccountBalance(personId, accountId);
  }

  @Get(':account_id/transactions')
  @ApiOkResponse({ description: 'All account transactions', type: [TransactionDto] })
  getAllTransactions(
    @Param('person_id') personId: number,
    @Param('account_id') accountId: number,
  ): Promise<TransactionDto[]> {
    return this.bankAccountService.getAccountTransactions(personId, accountId);
  }

  @Patch(':account_id/block')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Status changed successfully' })
  patchBlockAccount(@Param('person_id') personId: number, @Param('account_id') accountId: number) {
    return this.bankAccountService.changeAccountStatus(personId, accountId, false);
  }

  @Patch(':account_id/unblock')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Status changed successfully' })
  patchUnBlockAccount(@Param('person_id') personId: number, @Param('account_id') accountId: number) {
    return this.bankAccountService.changeAccountStatus(personId, accountId, true);
  }

  @Post()
  createAccount(
    @Param('person_id') personId: number,
    @Body() createAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountDto> {
    return this.bankAccountService.createAccount(personId, createAccountDto);
  }

  @Post(':account_id/deposit')
  @ApiOkResponse({ description: 'Account balance', type: BalanceDto })
  createDepositTransaction(
    @Param('person_id') personId: number,
    @Param('account_id') accountId: number,
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<BalanceDto> {
    return this.bankAccountService.createDepositTransaction(personId, accountId, transactionDto);
  }
}
