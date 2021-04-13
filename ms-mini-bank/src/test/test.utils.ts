import { TypeOrmModule } from '@nestjs/typeorm';
import getTypeOrmConfig from '../utils/typeorm.config';
import { DynamicModule } from '@nestjs/common';
import { Connection, createConnection, getConnection, getRepository } from 'typeorm';
import envVars from '../utils/environ';
import { Person } from '../model/person';
import { BankAccount } from '../model/bankAccount';
import { AccountTransaction } from '../model/accountTransaction';
import faker from 'faker';
import * as cpf from '@fnando/cpf';

export class TestUtils {
  private static typeOrmModule: DynamicModule;
  private static connection: Connection;

  private constructor() {
    TestUtils.typeOrmModule = TypeOrmModule.forRoot(getTypeOrmConfig());
  }

  private static async makeConnection() {
    TestUtils.connection = await createConnection({
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
    if (!TestUtils.connection) {
      await TestUtils.makeConnection();
    }
    return TestUtils.connection;
  }

  public static getInstance(): DynamicModule {
    if (!TestUtils.typeOrmModule) {
      new TestUtils();
    }
    return TestUtils.typeOrmModule;
  }

  public static closeConnection() {
    try {
      const connection = getConnection();
      if (connection.isConnected) {
        return connection.close();
      }
    } catch (e) {}
  }

  public static async getTestPerson(): Promise<Person> {
    const repository = getRepository<Person>(Person);
    const testPerson = await repository.findOne({ name: 'test_person' });
    if (!!testPerson) {
      return testPerson;
    } else {
      const person = new Person();
      person.cpf = cpf.generate();
      person.name = 'test_person';
      person.birthDate = faker.datatype.datetime();
      person.password = 'simple123';
      return await repository.save(person);
    }
  }
}
