import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../../model/person';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import envVars from '../../utils/environ';
import { LoginController } from '../login.controller';
import { LoginService } from '../login.service';
import { JwtStrategy } from '../jwt.strategy';
import { TestUtils } from '../../test/test.utils';
import { getRepository } from 'typeorm';
import faker from 'faker';

export function getLoginTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      TestUtils.getInstance(),
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
  const person = await TestUtils.getTestPerson();
  return person.cpf;
}
