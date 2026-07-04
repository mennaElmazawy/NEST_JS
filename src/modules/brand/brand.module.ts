import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { UserModel } from '../../DB/models/user.model.js';
import TokenService from '../../common/service/token.services.js';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../../DB/repository/user.repositories.js';
import BrandRepository from '../../DB/repository/brand.repositories.js';
import { BrandModel } from '../../DB/models/brand.model.js';
import { S3Service } from '../../common/service/s3service.js';

@Module({
  imports:[UserModel,BrandModel],
  controllers: [BrandController],
  providers: [BrandService,TokenService, JwtService,UserRepository,BrandRepository,S3Service]
})
export class BrandModule {}
