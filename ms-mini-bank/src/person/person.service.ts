import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../model/person';
import { Repository } from 'typeorm';
import { PersonDto } from './person.dto';

@Injectable()
export class PersonService {
  constructor(@InjectRepository(Person) private readonly personRepository: Repository<Person>) {}

  async findAll(): Promise<PersonDto[]> {
    const person = await this.personRepository.find();
    return person.map((person) => {
      return {
        id: person.idPerson,
        birthDate: person.birthDate,
        cpf: person.cpf,
        name: person.name,
      } as PersonDto;
    });
  }
}
