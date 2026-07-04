import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../common/decorator/auth.decorator.js';
import { BrandService } from './brand.service';
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerCloud } from '../../common/utils/multer.utils.js';
import { createBrandDto, IdDto, QueryDto, updateBrandDto } from './brand.dto.js';
import { User } from '../../common/decorator/user.decorator.js';
import type { HUserDocument } from '../../DB/models/user.model.js';
import { RoleEnum } from '../../common/enum/user.enum.js';

@Controller('brand')
export class BrandController {

    constructor(
        private readonly brandService:BrandService
    ){}

    @Post()
    @Auth({role:[RoleEnum.admin]})
    @UseInterceptors(FileInterceptor("attachment", multerCloud()))
    createBrand(
        @Body() body:createBrandDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @User() user:HUserDocument
    ){
        return this.brandService.createBrand(body, file, user)
    }


    @Patch("/:id")
    @Auth({role:[RoleEnum.admin]})
    @UseInterceptors(FileInterceptor("attachment", multerCloud()))
    
    updateBrand(
        @Param() params:IdDto,
        @Body() body:updateBrandDto,
        @User() user:HUserDocument
    ){
        return this.brandService.updateBrand(body,params.id,user)
    }


    @Get()
    getAllBrands(
        @Query() query:QueryDto
    ){
        return this.brandService.getAllBrands(query)
    }

    @Delete("/:id")
    @Auth({role:[RoleEnum.admin]})
    deleteBrand(
        @Param() params:IdDto,
        @User() user:HUserDocument
    ){
        return this.brandService.deleteBrand(params.id,user)
    }
}
      

