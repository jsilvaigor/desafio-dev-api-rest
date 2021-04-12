import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../../model/person';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import envVars from '../../utils/environ';
import { LoginController } from '../login.controller';
import { LoginService } from '../login.service';
import { JwtStrategy } from '../jwt.strategy';
import { TypeOrmForTest } from '../../test/test.utils';
import { getRepository } from 'typeorm';
import faker from 'faker';

export function getLoginTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      TypeOrmForTest.getInstance(),
      TypeOrmModule.forFeature([Person]),
      PassportModule,
      JwtModule.register({
        secret: envVars.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
    ],
    controllers: [LoginController],
    providers: [LoginService, JwtStrategy],
  }).compile();
}

export async function getPersonCpfToLogin(): Promise<string> {
  const repository = getRepository<Person>(Person);
  const testPerson = await repository.findOne({ name: 'test_person' });
  if (!!testPerson) {
    return testPerson.cpf;
  } else {
    const person = new Person();
    person.cpf = '123456' + faker.datatype.number(9999);
    person.name = 'test_person';
    person.birthDate = faker.datatype.datetime();
    person.password = 'simple123';
    const saved = await repository.save(person);
    return saved.cpf;
  }
}
