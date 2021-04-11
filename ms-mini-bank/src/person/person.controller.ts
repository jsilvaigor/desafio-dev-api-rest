import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonCreateDto, PersonDto } from './person.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../login/jwt.guard';
import { ValidatePersonId } from '../login/secondLevel.guard';

@Controller('person')
@ApiTags('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'All users in database', type: [PersonDto] })
  @ApiUnauthorizedResponse({ description: 'Auth token is required' })
  getAll(): Promise<PersonDto[]> {
    return this.personService.findAll();
  }

  @Get(':person_id')
  @UseGuards(JwtAuthGuard, ValidatePersonId)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The desired user', type: PersonDto })
  @ApiUnauthorizedResponse({ description: 'Auth token is required' })
  @ApiForbiddenResponse({ description: "Oops! You don't have permission to see this information." })
  getOne(@Param('person_id') personId: number): Promise<PersonDto> {
    return this.personService.findOne(personId);
  }

  @Post()
  @ApiCreatedResponse({ description: 'The created user', type: PersonDto })
  createPerson(@Body() createPersonDto: PersonCreateDto): Promise<PersonDto> {
    return this.personService.create(createPersonDto);
  }
}
