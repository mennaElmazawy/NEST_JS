import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../common/decorator/auth.decorator.js';
import { ProductService } from './product.service.js';
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { multerCloud } from '../../common/utils/multer.utils.js';
import { createProductDto, IdDto, QueryDto, updateProductDto } from './product.dto.js';
import { User } from '../../common/decorator/user.decorator.js';
import type { HUserDocument } from '../../DB/models/user.model.js';
import { RoleEnum } from '../../common/enum/user.enum.js';


@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) { }

    @Post()
    @Auth({ role: [RoleEnum.admin] })
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ], multerCloud()))
    createProduct(
        @Body() body: createProductDto,
        @UploadedFiles() files: { mainImage: Express.Multer.File, subImages: Express.Multer.File[] },
        @User() user: HUserDocument
    ) {
        return this.productService.createProduct(body, files, user)
    }


    @Patch("/:id")
    @Auth({ role: [RoleEnum.admin] })
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ], multerCloud()))

    updateProduct(
        @Param() params: IdDto,
        @Body() body: updateProductDto,
        @User() user: HUserDocument,
        @UploadedFiles() files?: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] },
    ) {
        return this.productService.updateProduct(body, params.id, user, files)
    }


    @Get()
    getAllProducts(
        @Query() query: QueryDto
    ) {
        return this.productService.getAllProducts(query)
    }

    @Delete("/:id")
    @Auth({ role: [RoleEnum.admin] })
    deleteProduct(
        @Param() params: IdDto,
        @User() user: HUserDocument
    ) {
        return this.productService.deleteProduct(params.id, user)
    }
}


