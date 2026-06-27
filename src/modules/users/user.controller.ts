import { Body, Controller, Get, Post, Req, SetMetadata, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { CreateUserDto, signInDto } from "./userDto/user.dto.js";
import { AuthenticationGuard } from "../../common/guards/authentication.guards.js";
import { TokenEnum } from "../../common/enum/token.enum.js";
import { Auth, Roles, TokenType } from "../../common/decorator/auth.decorator.js";
import { AuthorizationGuard } from "../../common/guards/authorization.guards.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { User } from "../../common/decorator/user.decorator.js";
import { type HUserDocument } from "../../DB/models/user.model.js";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { Request } from "express";
import { multerCloud } from "../../common/utils/multer.utils.js";



@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    // @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.user] })
    getUsers(@Req() req: any) {
        return this.userService.getUsers()
    }


    @Get("profile")
    @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.user] })
    getUProfile(@User() user: HUserDocument) {
        return user
    }


    @Post("signUp")
    SignUp(@Body() body: CreateUserDto): any {
        return this.userService.SignUp(body)
    }
    @Post("signIn")
    signIn(@Body() body: signInDto): any {
        return this.userService.signIn(body)
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("attachment",multerCloud()))
    uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
        return this.userService.uploadProfileImage(file);
    }

}