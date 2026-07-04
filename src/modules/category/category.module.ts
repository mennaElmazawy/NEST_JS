import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { UserModel } from '../../DB/models/user.model.js';
import TokenService from '../../common/service/token.services.js';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../../DB/repository/user.repositories.js';
import BrandRepository from '../../DB/repository/brand.repositories.js';
import { BrandModel } from '../../DB/models/brand.model.js';
import { S3Service } from '../../common/service/s3service.js';
import CategoryRepository from '../../DB/repository/category.repositories.js';
import { CategoryModel } from '../../DB/models/category.model.js';
import { CategoryService } from './category.service.js';

@Module({
  imports:[UserModel,BrandModel,CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService,TokenService, JwtService,UserRepository,BrandRepository,S3Service,CategoryRepository],
})
export class CategoryModule {}
