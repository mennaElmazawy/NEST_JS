
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


export function AtLeastOne(requiredFields: string[], validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: "",
      options: validationOptions,
      constraints: requiredFields,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return requiredFields.some(field => args.object[field]);
        },

        defaultMessage(args: ValidationArguments) {

          return `At least one of required fields of ${requiredFields.join(" , ")}is missing`;
        }
      },
    });
  };
}

