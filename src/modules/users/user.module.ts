import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserModel } from "../../DB/models/user.model.js";
import UserRepository from "../../DB/repository/user.repositories.js";
import RedisService from "../../common/service/redis.service.js";
import { RedisModule } from "../../common/redis/redis.module.js";
import TokenService from "../../common/service/token.services.js";
import { JwtService } from "@nestjs/jwt";



@Module({
    imports:[UserModel, RedisModule],
    controllers:[UserController],
    providers:[
        UserService,
        UserRepository,
        RedisService,
        TokenService,
        JwtService
    ],
    exports:[]
})
export class UserModule{}