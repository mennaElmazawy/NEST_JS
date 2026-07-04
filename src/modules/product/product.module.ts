import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { UserModel } from '../../DB/models/user.model.js';
import TokenService from '../../common/service/token.services.js';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../../DB/repository/user.repositories.js';
import BrandRepository from '../../DB/repository/brand.repositories.js';
import { BrandModel } from '../../DB/models/brand.model.js';
import { S3Service } from '../../common/service/s3service.js';
import CategoryRepository from '../../DB/repository/category.repositories.js';
import { CategoryModel } from '../../DB/models/category.model.js';
import { ProductService } from './product.service.js';
import { ProductModel } from '../../DB/models/product.model.js';
import ProductRepository from '../../DB/repository/product.repositories.js';

@Module({
  imports:[UserModel,BrandModel,CategoryModel,ProductModel],
  controllers: [ProductController],
  providers: [ProductService,TokenService, JwtService,UserRepository,BrandRepository,S3Service,CategoryRepository,ProductRepository],
})
export class ProductModule {}
