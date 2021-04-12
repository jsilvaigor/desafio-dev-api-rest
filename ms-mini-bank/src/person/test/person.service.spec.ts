import { TestingModule } from '@nestjs/testing';
import { PersonService } from '../person.service';
import { getPersonModuleForTesting } from './person.utils';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await getPersonModuleForTesting();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
