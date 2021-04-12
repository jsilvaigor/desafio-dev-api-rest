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
