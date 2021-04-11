/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import { LoginModule } from './login/login.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import getTypeOrmConfig from './utils/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(getTypeOrmConfig()), PersonModule, LoginModule, BankAccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
