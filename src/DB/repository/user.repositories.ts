
import { Model } from 'mongoose';
import BaseRepository from './base.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model.js';
import { Injectable } from '@nestjs/common';


@Injectable()
class UserRepository extends BaseRepository<User> {
    constructor(@InjectModel(User.name) protected Model:Model<User>) {
        super(Model);
    }

}

export default  UserRepository