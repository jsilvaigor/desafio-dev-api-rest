import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../login.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import getTypeOrmConfig from "../../utils/typeorm.config";
import { Person } from "../../model/person";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import envVars from "../../utils/environ";
import { LoginController } from "../login.controller";
import { JwtStrategy } from "../jwt.strategy";

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
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

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
