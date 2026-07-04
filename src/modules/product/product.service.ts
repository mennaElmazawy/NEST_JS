import { S3Service } from '../../common/service/s3service';
import { BadGatewayException, ConflictException, Injectable, NotFoundException, Query } from '@nestjs/common';
import BrandRepository from '../../DB/repository/brand.repositories.js';
import { createProductDto, QueryDto, updateProductDto } from './product.dto.js';
import { type HUserDocument } from '../../DB/models/user.model.js';
import { Types } from 'mongoose';
import CategoryRepository from '../../DB/repository/category.repositories.js';
import ProductRepository from '../../DB/repository/product.repositories.js';

@Injectable()
export class ProductService {

    constructor(
        private readonly brandRepo: BrandRepository,
        private readonly categoryRepo: CategoryRepository,
        private readonly productRepo: ProductRepository,
        private readonly S3Service: S3Service
    ) { }

    async createProduct(
        body: createProductDto,
        files: { mainImage: Express.Multer.File, subImages: Express.Multer.File[] },
        user: HUserDocument) {

        let { name, brandId, categoryId, description, price, stock, discount } = body
        brandId= new Types.ObjectId(brandId)
        categoryId= new Types.ObjectId(categoryId)

        if (!await this.brandRepo.findOne({ filter: { _id: brandId } })) {
            throw new NotFoundException("brand not exist")
        }
        if (!await this.categoryRepo.findOne({ filter: { _id: categoryId } })) {
            throw new NotFoundException("category not exist")
        }
        price = price - (price * ((discount || 0) / 100))

        const mainImage = await this.S3Service.uploadFile({
            file: files.mainImage[0],
            path: "products/mainImage"
        })
        let subImages;
        if (files.subImages.length > 0) {
            subImages = await this.S3Service.uploadFiles({
                files: files.subImages,
                path: "products/subImages"
            })
        }

        const product = await this.productRepo.create({
            name,
            mainImage,
            subImages,
            description,
            price,
            brandId,
            categoryId,
            stock,
            discount,
            createdBy: user._id,
        })
        if (!product) {
            await this.S3Service.deleteFile(mainImage)
            if (subImages) {
                await this.S3Service.deleteFiles(subImages)
            }
            throw new BadGatewayException("fail to create product")
        }
        return product
    }
    async updateProduct(body: updateProductDto, id: Types.ObjectId, user: HUserDocument, files?: { mainImage?: Express.Multer.File, subImages?: Express.Multer.File[] }) {
        let { name, price, stock, discount, description, brandId, categoryId, removeSubImages } = body
        const product = await this.productRepo.findOne({ filter: { _id: id } })
        if (!product) {
            throw new ConflictException("product not exist")
        }
        if (brandId) {
            const brand = await this.brandRepo.findOne({ filter: { _id: brandId } })
            brandId= new Types.ObjectId(brandId)
            if (!brand) {
                throw new NotFoundException("brand not exist")
            }
        }
        if (categoryId) {
            const category = await this.categoryRepo.findOne({ filter: { _id: categoryId } })
            categoryId= new Types.ObjectId(categoryId)
            if (!category) {
                throw new NotFoundException("category not exist")
            }
        }
        
        if (price || discount) {
            price ??= product.price;
            discount ??= product.discount;
            price = price - (price * ((discount || 0) / 100))
        }
        let mainImage: string = product.mainImage;
        if (files?.mainImage) {
            mainImage = await this.S3Service.uploadFile({
                file: files.mainImage[0],
                path: "products/mainImage"
            })
        }
        let subImages: string[] = product.subImages || [];
        if (files?.subImages?.length) {
            subImages = await this.S3Service.uploadFiles({
                files: files.subImages,
                path: "products/subImages"
            })
        }
        if (removeSubImages?.length) {
            subImages = subImages.filter(img => !removeSubImages.includes(img))
            await this.S3Service.deleteFiles(removeSubImages)
        }

        const updated = await this.productRepo.findOneAndUpdate({

            filter: { _id: id },
            update: {
                ...(name ? { name } : {}),
                ...(description ? { description } : {}),
                ...(brandId ? { brandId } : {}),
                ...(categoryId ? { categoryId } : {}),
                price,
                ...(stock ? { stock } : {}),
                discount,
                mainImage,
                subImages,
                updatedBy: user._id,

            }
        })
        if (!updated) {
            if (files?.mainImage) {
                await this.S3Service.deleteFile(mainImage)

            }
            if (files?.subImages?.length) {
                await this.S3Service.deleteFiles(subImages)
            }
            throw new BadGatewayException("fail to update product")
        }
        return updated

    }


    async getAllProducts(Query: QueryDto) {
        const { page, limit, search } = Query
        const products = await this.productRepo.paginate({
            page,
            limit,
            search: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } }

                ]
            } : {}
        })
        return products
    }

    async deleteProduct(id: Types.ObjectId, user: HUserDocument) {
        const product = await this.productRepo.findOne({ filter: { _id: id } })
        if (!product) {
            throw new ConflictException("product not exist")
        }

        const deleted = await this.productRepo.findOneAndUpdate({
            filter: { _id: id },
            update: {
                deletedAt: new Date(),
                deletedBy: user._id
            }
        })
        if (!deleted) {
            throw new BadGatewayException("fail to delete product")

        }
        return deleted

    }



}
