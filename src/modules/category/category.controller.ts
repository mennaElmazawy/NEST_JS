import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../common/decorator/auth.decorator.js';
import { CategoryService } from './category.service.js';
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multerCloud } from '../../common/utils/multer.utils.js';
import { createCategoryDto, IdDto, QueryDto, updateCategoryDto } from './category.dto.js';
import { User } from '../../common/decorator/user.decorator.js';
import type { HUserDocument } from '../../DB/models/user.model.js';
import { RoleEnum } from '../../common/enum/user.enum.js';

@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post()
    @Auth({ role: [RoleEnum.admin] })
    @UseInterceptors(FileInterceptor("attachment", multerCloud()))
    createCategory(
        @Body() body: createCategoryDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @User() user: HUserDocument
    ) {
        return this.categoryService.createCategory(body, file, user)
    }


    @Patch("/:id")
    @Auth({ role: [RoleEnum.admin] })
    @UseInterceptors(FileInterceptor("attachment", multerCloud()))
    updateCategory(
        @Param() params: IdDto,
        @Body() body: updateCategoryDto,
        @User() user: HUserDocument,
        @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file?: Express.Multer.File
    ) {
        return this.categoryService.updateCategory(body, params.id, user, file)
    }



    @Get()
    getAllCategories(
        @Query() query: QueryDto
    ) {
        return this.categoryService.getAllCategories(query)
    }

    @Delete("/:id")
    @Auth({ role: [RoleEnum.admin] })
    deleteCategory(
        @Param() params: IdDto,
        @User() user: HUserDocument
    ) {
        return this.categoryService.deleteCategory(params.id, user)
    }
}


