import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";
import { AtLeastOne } from "../../common/decorator/brand.decorator.js";
import { Types } from "mongoose";
import { Type } from "class-transformer";


export class createBrandDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    slogan: string;
}

@AtLeastOne(["name", "slogan"])
export class updateBrandDto extends PartialType(createBrandDto) {

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