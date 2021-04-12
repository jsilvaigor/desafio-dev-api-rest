import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import envVars from './environ';
import { Person } from '../model/person';
import { BankAccount } from '../model/bankAccount';
import { AccountTransaction } from '../model/accountTransaction';

export default function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: envVars.PGSQL_HOST,
    port: envVars.PGSQL_PORT,
    username: envVars.PGSQL_USER,
    password: envVars.PGSQL_PASS,
    database: envVars.PGSQL_DATABASE,
    entities: [Person, BankAccount, AccountTransaction],
    synchronize: false,
  };
}

export const ColumnNumericTransformer = {
  to(data: number): number {
    return data;
  },
  from(data: string): number {
    return parseFloat(data);
  },
};
