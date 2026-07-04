
import { Model } from 'mongoose';
import BaseRepository from './base.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from '../models/brand.model.js';
import { Injectable } from '@nestjs/common';


@Injectable()
class BrandRepository extends BaseRepository<Brand> {
    constructor(@InjectModel(Brand.name) protected Model:Model<Brand>) {
        super(Model);
    }

}

export default  BrandRepository