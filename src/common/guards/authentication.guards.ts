
import { Injectable, CanActivate, ExecutionContext, BadGatewayException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import TokenService from '../service/token.services.js';
import { TokenEnum } from '../enum/token.enum.js';
import { Reflector } from '@nestjs/core';
import { token_key } from '../decorator/token.decorator.js';




@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly tokenService: TokenService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {


        const  tokenType= this.reflector.get(token_key, context.getHandler()) 

        let req: any
        let authorization: string = ""
        if (context.getType() === "http") {
            req = context.switchToHttp().getRequest();
            authorization = req.headers.authorization;
        }
        else if (context.getType() === "rpc") {
            // req = context.switchToRpc().getData();
            // authorization = req.headers.authorization;
        }
        else if (context.getType() === "ws") {
            // req = context.switchToWs().getClient();
            // authorization = req.handshake.headers.authorization;
        }
        if (!authorization) {
            throw new BadGatewayException("token not exist")
        }

        const [prefix, token] = authorization.split(" ");
        if (!prefix || !token) {
            throw new BadGatewayException("token or prefix not exist")
        }

        const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = await this.tokenService.getSegnature(prefix)
        
        let secret = tokenType === TokenEnum.access_token ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;
       
        try {
            var { user, decoded } = await this.tokenService.decodeToken_and_fetchUser(token,secret);
            
        } catch (error) {
            throw new HttpException({message:"invalid token error",error}, 401)
        }

        req.user = user;
        req.decoded = decoded;
        return true;
    }
}
