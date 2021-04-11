/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import getTypeOrmConfig from './utils/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(getTypeOrmConfig()), PersonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
