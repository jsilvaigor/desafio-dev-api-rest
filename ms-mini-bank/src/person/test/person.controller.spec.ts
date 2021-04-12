import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from '../person.controller';
import { getPersonModuleForTesting } from './person.utils';
import { Person } from '../../model/person';
import * as faker from 'faker';
import { PersonCreateDto } from '../person.dto';
import * as moment from 'moment';

describe('PersonController', () => {
  let controller: PersonController;
  let person: Person;

  beforeAll(async () => {
    person = new Person();
    person.cpf = '123456' + faker.datatype.number(9999);
    person.name = 'test_person';
    person.birthDate = faker.datatype.datetime();
    person.password = 'simple123';
  });

  beforeEach(async () => {
    const module: TestingModule = await getPersonModuleForTesting();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should save a person', async () => {
    const personDto: PersonCreateDto = {
      cpf: person.cpf,
      name: person.name,
      birthDate: person.birthDate,
      password: person.password,
    };
    const saved = await controller.createPerson(personDto);
    expect(saved).toBeDefined();
    expect(saved.id).toBeGreaterThan(0);
    // saving id for future use
    person.idPerson = saved.id;
    expect(saved.cpf).toBe(personDto.cpf);
    expect(saved.name).toBe(personDto.name);
    expect(saved.birthDate).toBe(personDto.birthDate);
  });

  it('should return a list of persons', async () => {
    const persons = await controller.getAll();
    expect(persons).toBeInstanceOf(Array);
    expect(persons.length).toBeGreaterThan(0);
    const personToCheck = persons.find((p) => p.id === person.idPerson);
    expect(personToCheck).toBeDefined();
    expect(personToCheck.cpf).toBe(person.cpf);
  });

  it('should return person data by Id', async () => {
    const personToCheck = await controller.getOne(person.idPerson);
    expect(personToCheck).toBeDefined();
    expect(personToCheck.id).toBe(person.idPerson);
    expect(personToCheck.cpf).toBe(person.cpf);
    expect(personToCheck.name).toBe(person.name);
    expect(moment(personToCheck.birthDate).startOf('day').toISOString()).toBe(
      moment(person.birthDate).startOf('day').toISOString(),
    );
  });
});
