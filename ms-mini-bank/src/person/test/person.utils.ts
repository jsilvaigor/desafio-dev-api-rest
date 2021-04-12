import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../../model/person';
import { PersonController } from '../person.controller';
import { PersonService } from '../person.service';
import { TypeOrmForTest } from '../../test/test.utils';

export function getPersonModuleForTesting(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [TypeOrmForTest.getInstance(), TypeOrmModule.forFeature([Person])],
    controllers: [PersonController],
    providers: [PersonService],
  }).compile();
}
