import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { getRepository } from "typeorm";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyUsedConstraint implements ValidatorConstraintInterface {
  async validate(email: string, _args: ValidationArguments) {
    const users = await getRepository(User).find({ where: { email: email } });
    return !users[0];
  }
  defaultMessage = (_args: ValidationArguments) => "$value already has an account";
}

export function IsEmailAlreadyUsed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyUsedConstraint,
    });
  };
}
