
import { Model } from 'mongoose';
import BaseRepository from './base.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Category } from '../models/category.model.js';


@Injectable()
class CategoryRepository extends BaseRepository<Category> {
    constructor(@InjectModel(Category.name) protected Model:Model<Category>) {
        super(Model);
    }

}

export default  CategoryRepository