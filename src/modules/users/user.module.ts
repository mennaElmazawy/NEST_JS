import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserModel } from "../../DB/models/user.model.js";
import UserRepository from "../../DB/repository/user.repositories.js";
import RedisService from "../../common/service/redis.service.js";
import { RedisModule } from "../../common/redis/redis.module.js";
import TokenService from "../../common/service/token.services.js";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import multer from "multer";
import { Request } from "express";
import { S3Service } from "../../common/service/s3service.js";



@Module({
    imports: [

        UserModel,
        RedisModule,

        // MulterModule.register({
        //     // storage: multer.memoryStorage(),
        //     storage: multer.diskStorage({
        //         destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        //             cb(null, './uploads');
        //         },
        //         filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        //             cb(null, Date.now() + file.originalname)
        //         }
        //     })
        // })

    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        RedisService,
        TokenService,
        JwtService,
        S3Service
    ],
    exports: []
})
export class UserModule { }