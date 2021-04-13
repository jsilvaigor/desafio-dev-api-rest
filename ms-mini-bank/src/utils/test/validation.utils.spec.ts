import { PersonCreateDto } from '../../person/person.dto';
import * as cpf from '@fnando/cpf';
import { validate, ValidationError } from 'class-validator';
import { Person } from '../../model/person';

describe('check cpf validate logic', () => {
  it('should validate cpf successfully', async () => {
    const person: PersonCreateDto = new PersonCreateDto();
    person.cpf = cpf.generate();
    person.birthDate = new Date().toISOString();
    person.password = 'simple';
    person.name = 'name';
    const validation = await validate(person);
    expect(validation).toHaveLength(0);
  });
  it('should return a validation error for cpf', async () => {
    const person: PersonCreateDto = new PersonCreateDto();
    person.cpf = 'wrong';
    person.birthDate = new Date().toISOString();
    person.password = 'simple';
    person.name = 'name';
    const validation = await validate(person);
    const error = validation[0];
    expect(validation).toHaveLength(1);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.value).toBe('wrong');
    expect(error.property).toBe('cpf');
  });
});
