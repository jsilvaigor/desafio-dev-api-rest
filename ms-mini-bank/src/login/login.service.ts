import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../model/person';
import { LoginDto, Token } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { checkPassword } from '../utils/password.utils';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    private readonly jwtService: JwtService,
  ) {}

  async doLogin(loginDto: LoginDto): Promise<Token> {
    const person = await this.personRepository.findOne({ where: { cpf: loginDto.cpf } });
    if (person) {
      const isPasswordCorrect = await checkPassword(loginDto.password, person.password);
      if (isPasswordCorrect) {
        const payload = { username: person.cpf, sub: person.idPerson };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    }
    throw new UnauthorizedException();
  }
}
