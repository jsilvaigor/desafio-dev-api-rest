import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonCreateDto, PersonDto } from './person.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('person')
@ApiTags('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  getAll(): Promise<PersonDto[]> {
    return this.personService.findAll();
  }

  @Get(':person_id')
  getOne(@Param('person_id') personId: number): Promise<PersonDto> {
    return this.personService.findOne(personId);
  }

  @Post()
  createPerson(@Body() createPersonDto: PersonCreateDto): Promise<PersonDto> {
    return this.personService.create(createPersonDto);
  }
}
