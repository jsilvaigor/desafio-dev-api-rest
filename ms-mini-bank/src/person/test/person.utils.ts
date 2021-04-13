import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../../model/person';
import { PersonController } from '../person.controller';
import { PersonService } from '../person.service';
import { TestUtils } from '../../test/test.utils';

export function getPersonModuleForTesting(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [TestUtils.getInstance(), TypeOrmModule.forFeature([Person])],
    controllers: [PersonController],
    providers: [PersonService],
  }).compile();
}
