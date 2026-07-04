import { Allow, IsEmail, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length, registerDecorator, Validate, ValidateIf, ValidationOptions } from "class-validator";

import { IsMatch } from "../../../common/decorator/user.decorator.js";
import { Types } from "mongoose";




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






