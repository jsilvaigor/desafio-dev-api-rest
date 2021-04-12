import { TypeOrmModule } from '@nestjs/typeorm';
import getTypeOrmConfig from '../utils/typeorm.config';
import { DynamicModule } from '@nestjs/common';
import { getConnection } from 'typeorm';

export class TypeOrmForTest {
  private static typeOrmModule: DynamicModule;

  private constructor() {
    TypeOrmForTest.typeOrmModule = TypeOrmModule.forRoot(getTypeOrmConfig());
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
