import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../model/person';
import { Repository } from 'typeorm';
import { PersonCreateDto, PersonDto } from './person.dto';
import { hashPassword } from '../utils/password.utils';

@Injectable()
export class PersonService {
  constructor(@InjectRepository(Person) private readonly personRepository: Repository<Person>) {}

  async findAll(): Promise<PersonDto[]> {
    const person = await this.personRepository.find();
    return person.map((person) => {
      return {
        id: person.idPerson,
        cpf: person.cpf,
      } as PersonDto;
    });
  }

  async create(createPersonDto: PersonCreateDto): Promise<PersonDto> {
    const person = new Person();
    person.cpf = createPersonDto.cpf;
    person.name = createPersonDto.name;
    person.birthDate = createPersonDto.birthDate;
    person.password = await hashPassword(createPersonDto.password);
    const saved = await this.personRepository.save(person);
    return this.personEntityToDto(saved);
  }

  async findOne(personId: number): Promise<PersonDto> {
    return this.personEntityToDto(await this.personRepository.findOne(personId));
  }

  private personEntityToDto(person: Person): PersonDto {
    return {
      id: person.idPerson,
      birthDate: person.birthDate,
      cpf: person.cpf,
      name: person.name,
    } as PersonDto;
  }
}
