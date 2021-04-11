import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pessoas' })
export class Person {
  @PrimaryGeneratedColumn({ name: 'idPessoa' })
  idPerson: number;
  @Column({ name: 'nome' })
  name: string;

  @Column()
  cpf: string;

  @Column({ name: 'dataNascimento' })
  birthDate: Date;

  @Column({ name: 'senha' })
  password: number;
}
