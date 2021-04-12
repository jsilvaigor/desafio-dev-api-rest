import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils/typeorm.config';
import { AccountTransaction } from './accountTransaction';

export enum BankAccountType {
  // Conta Corrente
  CheckingAccount = 0,
  // Conta Poupanca
  SavingsAccount = 1,
}

@Entity({ name: 'contas' })
export class BankAccount {
  @PrimaryGeneratedColumn({ name: 'idConta' })
  idAccount: number;

  @Column({ name: 'idPessoa' })
  idPerson: number;

  @Column({
    name: 'saldo',
    type: 'numeric',
    precision: 16,
    scale: 2,
    transformer: ColumnNumericTransformer,
  })
  balance: number;

  @Column({
    name: 'limiteSaqueDiario',
    type: 'numeric',
    precision: 16,
    scale: 2,
    transformer: ColumnNumericTransformer,
  })
  dailyWithdrawLimit: number;

  @Column({ name: 'flagAtivo' })
  isActive: boolean;

  @Column({ name: 'tipoConta', type: 'enum', enum: BankAccountType, default: BankAccountType.CheckingAccount })
  accountType: number;

  @CreateDateColumn({ name: 'dataCriacao' })
  creationDate: Date;

  @OneToMany(() => AccountTransaction, (accountTransaction) => accountTransaction.bankAccount)
  @JoinColumn()
  accountTransactions: AccountTransaction[];
}
