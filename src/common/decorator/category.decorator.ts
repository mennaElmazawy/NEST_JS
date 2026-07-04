
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Types } from 'mongoose';
@ValidatorConstraint({ name: 'customText', async: false })
export class ValidateIds implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments) {
    return value.filter(id=>Types.ObjectId.isValid(id)).length == value.length;
  }

  defaultMessage(args: ValidationArguments) {

    return `some of ids is invalid`;
  }
}

