import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { CreateUserDto, signInDto } from "./userDto/user.dto.js";



@Controller("users")
export class UserController {
    constructor( private readonly userService:UserService){}

    @Get()
    getUsers(){
        return this.userService.getUsers()
    }

  
    @Post("signUp")
    SignUp(@Body() body:CreateUserDto):any{
        return this.userService.SignUp(body)
    }
    @Post("signIn")
    signIn(@Body() body:signInDto):any{
        return this.userService.signIn(body)
    }
}