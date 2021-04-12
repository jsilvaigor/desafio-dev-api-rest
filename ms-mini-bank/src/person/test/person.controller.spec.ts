import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from '../person.controller';
import { getPersonModuleForTesting } from './person.utils';

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await getPersonModuleForTesting();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
