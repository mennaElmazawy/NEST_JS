import { PartialType } from "@nestjs/mapped-types";
import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min, Validate } from "class-validator";
import { AtLeastOne } from "../../common/decorator/brand.decorator.js";
import { Types } from "mongoose";
import { Type } from "class-transformer";
import { ValidateIds } from "../../common/decorator/category.decorator.js";


export class createProductDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;


    @IsString()
    @Length(3, 50000)
    description: string;

    @IsNotEmpty()
    @IsMongoId()
    brandId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    categoryId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    stock: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @IsOptional()
    discount?: number
}


export class updateProductDto extends PartialType(createProductDto) {
    @IsString({ each: true })
    @IsArray()
    @ArrayUnique()
    @IsOptional()
    removeSubImages?: string[]
}


export class IdDto {
    @IsNotEmpty()
    @IsMongoId()
    id: Types.ObjectId
}

export class QueryDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number

    @IsOptional()
    @IsString()
    search: string
}