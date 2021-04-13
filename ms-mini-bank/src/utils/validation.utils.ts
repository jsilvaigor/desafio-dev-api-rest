import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as cpf from '@fnando/cpf';

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return cpf.isValid(value);
        },
      },
    });
  };
}
