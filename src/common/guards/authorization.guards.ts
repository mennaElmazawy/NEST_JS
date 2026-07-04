
import { Injectable, CanActivate, ExecutionContext, BadGatewayException, HttpException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import TokenService from '../service/token.services.js';
import { TokenEnum } from '../enum/token.enum.js';
import { Reflector } from '@nestjs/core';
import { role_key } from '../decorator/roles.decorator.js';




@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const Roles = this.reflector.get(role_key, context.getHandler()) as string[]

            let req: any
            if (context.getType() === "http") {
                req = context.switchToHttp().getRequest();

            }
            else if (context.getType() === "rpc") {
                // req = context.switchToRpc().getData();
                // authorization = req.headers.authorization;
            }
            else if (context.getType() === "ws") {
                // req = context.switchToWs().getClient();
                // authorization = req.handshake.headers.authorization;
            }
            if (!Roles.includes(req.user.role)) {
                throw new UnauthorizedException()
            }
            return true;
        } catch (error:any) {
            throw new BadGatewayException(error.message)

        }


    }
}
