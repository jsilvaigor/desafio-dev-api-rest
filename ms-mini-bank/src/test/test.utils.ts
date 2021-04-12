import { TypeOrmModule } from '@nestjs/typeorm';
import getTypeOrmConfig from '../utils/typeorm.config';
import { DynamicModule } from '@nestjs/common';
import { Connection, createConnection, getConnection } from 'typeorm';
import envVars from '../utils/environ';
import { Person } from '../model/person';
import { BankAccount } from '../model/bankAccount';
import { AccountTransaction } from '../model/accountTransaction';

export class TypeOrmForTest {
  private static typeOrmModule: DynamicModule;
  private static connection: Connection;

  private constructor() {
    TypeOrmForTest.typeOrmModule = TypeOrmModule.forRoot(getTypeOrmConfig());
  }

  private static async makeConnection() {
    TypeOrmForTest.connection = await createConnection({
      type: 'postgres',
      host: envVars.PGSQL_HOST,
      port: envVars.PGSQL_PORT,
      username: envVars.PGSQL_USER,
      password: envVars.PGSQL_PASS,
      database: envVars.PGSQL_DATABASE,
      entities: [Person, BankAccount, AccountTransaction],
    });
  }

  public static async getConnection(): Promise<Connection> {
    if (!TypeOrmForTest.connection) {
      await TypeOrmForTest.makeConnection();
    }
    return TypeOrmForTest.connection;
  }

  public static getInstance(): DynamicModule {
    if (!TypeOrmForTest.typeOrmModule) {
      new TypeOrmForTest();
    }
    return TypeOrmForTest.typeOrmModule;
  }

  public static closeConnection() {
    try {
      const connection = getConnection();
      if (connection.isConnected) {
        return connection.close();
      }
    } catch (e) {}
  }
}
