import { Allow, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from "class-validator";

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class matchKey implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return args.value === args.object[args.constraints[0]];
    }

    defaultMessage(args: ValidationArguments) {

        return `${args.property} not match ${args.constraints[0]}`;
    }
}
export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: matchKey,
        });
    };
}


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 15, { message: "name is too short" })
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsInt()
    age: number


    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ValidateIf((data: CreateUserDto) => {
        return Boolean(data.password)
    })
    @IsMatch(["password"])
    cPassword: string;
    
    @IsOptional()
    @IsString()
    phone: string



}
export class signInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

}





