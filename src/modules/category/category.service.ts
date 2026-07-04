import { S3Service } from '../../common/service/s3service';
import { BadGatewayException, ConflictException, Injectable, Query } from '@nestjs/common';
import BrandRepository from '../../DB/repository/brand.repositories.js';
import { createCategoryDto, QueryDto, updateCategoryDto } from './category.dto.js';
import { type HUserDocument } from '../../DB/models/user.model.js';
import { Types } from 'mongoose';
import CategoryRepository from '../../DB/repository/category.repositories.js';

@Injectable()
export class CategoryService {

    constructor(
        private readonly brandRepo: BrandRepository,
        private readonly categoryRepo: CategoryRepository,
        private readonly S3Service: S3Service
    ) { }

    async createCategory(body: createCategoryDto, file: Express.Multer.File, user: HUserDocument) {
        const { name, brandIds } = body

        if (await this.categoryRepo.findOne({ filter: { name } })) {
            throw new ConflictException("name already exist")
        }
        const strictIds = ([...new Set(brandIds || [])]).map(id => Types.ObjectId.createFromHexString(id))
        if (brandIds && (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } })).length != strictIds.length) {
            throw new ConflictException("some brands not exist")
        }
        const image = await this.S3Service.uploadFile({
            file,
            path: "category"
        })
        const category = await this.categoryRepo.create({
            name,
            image,
            brandIds: strictIds,
            createdBy: user._id,
        })
        if (!category) {
            await this.S3Service.deleteFile(image)
            throw new BadGatewayException("fail to create category")
        }
        return category
    }
    async updateCategory(body: updateCategoryDto, id: Types.ObjectId, user: HUserDocument, file?: Express.Multer.File) {
        const { name, brandIds, removeBrandsIds } = body
        const category = await this.categoryRepo.findOne({ filter: { _id: id } })
        if (!category) {
            throw new ConflictException("category not exist")
        }
        if (name && name == category.name) {
            throw new ConflictException("name not change please make any change to update it")
        }
        if (name && await this.categoryRepo.findOne({ filter: { name } })) {
            throw new ConflictException("name already exist")
        }

        const strictIds = ([...new Set(brandIds || [])]).map(id => Types.ObjectId.createFromHexString(id))
        if (brandIds && (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } })).length != strictIds.length) {
            throw new ConflictException("some brands not exist")
        }
        let updatedImage!: string;
        if (file) {
            updatedImage = await this.S3Service.uploadFile({
                file,
                path: "category"
            })
        }
        const currentBrandIds = category.brandIds.map(id => id.toString());
        const afterRemove = currentBrandIds.filter(id => !removeBrandsIds?.includes(id));
        const finalBrandIds = [...new Set([...afterRemove, ...(brandIds || [])])];

        const updated = await this.categoryRepo.findOneAndUpdate({
            filter: { _id: id },
            update: {
                ...(name ? { name } : {}),
                ...(file ? { image: updatedImage } : {}),
                brandIds: finalBrandIds.map(id => Types.ObjectId.createFromHexString(id)),
                updatedBy: user._id,
            }

        })
        if (!updated) {
            if (file) {
                await this.S3Service.deleteFile(updatedImage)
            }

            throw new BadGatewayException("fail to update category")
        }

        return updated

    }


    async getAllCategories(Query: QueryDto) {
        const { page, limit, search } = Query
        const categories = await this.categoryRepo.paginate({
            page,
            limit,
            search: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },

                ]
            } : {}
        })
        return categories
    }


    async deleteCategory(id: Types.ObjectId, user: HUserDocument) {
        const category = await this.categoryRepo.findOne({ filter: { _id: id } })
        if (!category) {
            throw new ConflictException("category not exist")
        }

        const deleted = await this.categoryRepo.findOneAndUpdate({
            filter: { _id: id },
            update: {
                deletedAt: new Date(),
                deletedBy: user._id
            }
        })
        if (!deleted) {
            throw new BadGatewayException("fail to delete category")

        }
        return deleted
    }
}
