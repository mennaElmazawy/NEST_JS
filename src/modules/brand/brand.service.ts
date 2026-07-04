import { S3Service } from './../../common/service/s3service';
import { BadGatewayException, ConflictException, Injectable, Query } from '@nestjs/common';
import BrandRepository from '../../DB/repository/brand.repositories.js';
import { createBrandDto, QueryDto, updateBrandDto } from './brand.dto.js';
import { type HUserDocument } from '../../DB/models/user.model.js';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {

    constructor(
        private readonly brandRepo: BrandRepository,
        private readonly S3Service: S3Service
    ) { }

    async createBrand(body: createBrandDto, file: Express.Multer.File, user: HUserDocument) {
        const { name, slogan } = body
        if (await this.brandRepo.findOne({ filter: { name } })) {
            throw new ConflictException("name already exist")
        }
        const logo = await this.S3Service.uploadFile({
            file,
            path: "brands"
        })
        const brand = await this.brandRepo.create({
            name,
            slogan,
            logo,
            createdBy: user._id,
        })
        if (!brand) {
            await this.S3Service.deleteFile(logo)
            throw new BadGatewayException("fail to create brand")
        }
        return brand
    }
    async updateBrand(body: updateBrandDto, id: Types.ObjectId, user: HUserDocument) {
        const { name, slogan } = body
        const brand = await this.brandRepo.findOne({ filter: { _id: id } })
        if (!brand) {
            throw new ConflictException("brand not exist")
        }
        if (name && name == brand.name) {
            throw new ConflictException("name not change please make any change to update it")
        }
        if (name && await this.brandRepo.findOne({ filter: { name } })) {
            throw new ConflictException("name already exist")
        }

        const updated = await this.brandRepo.findOneAndUpdate({
            filter: { _id: brand.id },
            update: {
                ...(name ? { name } : undefined),
                ...(slogan ? { slogan } : undefined),
                updatedBy: user._id,
            }
        })
        return updated

    }


    async getAllBrands(Query: QueryDto) {
        const { page, limit, search } = Query
        const brands = await this.brandRepo.paginate({
            page,
            limit,
            search: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { slogan: { $regex: search, $options: "i" } }
                ]
            } : {}
        })
        return brands
    }

    async deleteBrand(id: Types.ObjectId, user: HUserDocument) {
        const brand = await this.brandRepo.findOne({ filter: { _id: id } })
        if (!brand) {
            throw new ConflictException("brand not exist")
        }

        const deleted = await this.brandRepo.findOneAndUpdate({
            filter: { _id: id },
            update: {
                deletedAt: new Date(),
                deletedBy: user._id
            }
        })
        if (!deleted) {
            throw new BadGatewayException("fail to delete brand")

        }
        return deleted
    }
}
