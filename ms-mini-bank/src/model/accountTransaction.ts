import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from './bankAccount';
import { ColumnNumericTransformer } from '../utils/typeorm.config';

@Entity({ name: 'transacoes' })
export class AccountTransaction {
  @PrimaryGeneratedColumn({ name: 'idTransacao' })
  idTransaction: number;

  @Column({ name: 'idConta' })
  idAccount: number;
  @ManyToOne(() => BankAccount, (bankAccount) => bankAccount.accountTransactions)
  @JoinColumn({ name: 'idConta' })
  bankAccount: BankAccount;

  @Column({
    name: 'valor',
    type: 'numeric',
    precision: 16,
    scale: 2,
    transformer: ColumnNumericTransformer,
  })
  amount: number;

  @Column({ name: 'dataTransacao' })
  transactionDate: Date;
}
