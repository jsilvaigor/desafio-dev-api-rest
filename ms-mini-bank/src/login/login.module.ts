/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../model/person';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import envVars from '../utils/environ';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    PassportModule,
    JwtModule.register({
      secret: envVars.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy],
})
export class LoginModule {}
