import { PartialType } from "@nestjs/mapped-types";
import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { AtLeastOne } from "../../common/decorator/brand.decorator.js";
import { Types } from "mongoose";
import { Type } from "class-transformer";
import { ValidateIds } from "../../common/decorator/category.decorator.js";


export class createCategoryDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;

    @IsOptional()
    @Validate(ValidateIds)
    brandIds: string[];
}


export class updateCategoryDto extends PartialType(createCategoryDto) {
    @IsMongoId({ each: true })
    @IsArray()
    @ArrayUnique()
    @IsOptional()
    removeBrandsIds?: string[]
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