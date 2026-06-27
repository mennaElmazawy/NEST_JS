

// import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import TokenService from '../service/token.services.js';
// import { TokenEnum } from '../enum/token.enum.js';

// @Injectable()
// export class Authentication implements NestMiddleware {
//     constructor(private readonly tokenService: TokenService) { }
    
//     async use (req: Request, res: Response, next: NextFunction) {
//         const { authorization } = req.headers;
//         if (!authorization) {
//             throw new BadRequestException("token not exist")
//         }

//         const [prefix, token] = authorization.split(" ");
//         if (!prefix || !token) {
//             throw new BadRequestException("token or prefix not exist")
//         }

//         const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = await this.tokenService.getSegnature(prefix)
//         let secret = tokenType === TokenEnum.access_token ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;
//         const { user, decoded } = await this.tokenService.decodeToken_and_fetchUser(token, secret);

//         req.user = user;
//         req.decoded = decoded;
//         next();
//     }
// }
