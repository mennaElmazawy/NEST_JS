
import { Model } from 'mongoose';
import BaseRepository from './base.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from '../models/product.model.js';


@Injectable()
class ProductRepository extends BaseRepository<Product> {
    constructor(@InjectModel(Product.name) protected Model:Model<Product>) {
        super(Model);
    }

}

export default  ProductRepository