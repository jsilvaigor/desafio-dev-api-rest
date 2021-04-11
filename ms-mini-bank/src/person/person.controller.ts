import { Controller, Get } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonDto } from './person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  getAll(): Promise<PersonDto[]> {
    return this.personService.findAll();
  }
}
