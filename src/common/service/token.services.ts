import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt'
import { JwtPayload } from 'jsonwebtoken'
import UserRepository from '../../DB/repository/user.repositories.js'


export interface IDecodedToken extends JwtPayload {
    id: string;
    jti: string;
}

@Injectable()
class TokenService {
    constructor(
        private jwtService: JwtService,
        private readonly userRepository: UserRepository,

    ) { }

    GenerateToken = ({
        payload,
        options
    }: {
        payload: object,
        options?: JwtSignOptions
    }): Promise<string> => {
        return this.jwtService.signAsync(payload, options)
    }

    VerifyToken = async ({
        token,
        options

    }: {
        token: string,
        options: JwtVerifyOptions,

    }): Promise<JwtPayload> => {
        return this.jwtService.verifyAsync(token, options)
    }
    getSegnature = async (prefix: string) => {
        let ACCESS_SECRET_KEY = '';
        let REFRESH_SECRET_KEY = '';
        if (prefix === process.env.PREFIX_USER) {
            ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY_USER!;
            REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY_USER!;
        } else if (prefix === process.env.PREFIX_ADMIN) {
            ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY_ADMIN!;
            REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY_ADMIN!;
        }
        return { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY };
    }
    decodeToken_and_fetchUser = async (token: string, secret: string) => {

        const decoded = await this.VerifyToken({
            token: token,
            options: { secret }
        }) as IDecodedToken;
        if (!decoded || !decoded?.id) {
            throw new BadRequestException("invalid token")
        }
        const user = await this.userRepository.findOne({ filter: { _id: decoded.id }, projection: "-password" })
        if (!user) {
            throw new BadRequestException("user not exist")
        }
       

        // const revokeToken = await redisService.get(redisService.revoked_key({ userId: decoded.id, jti: decoded.jti! }));
        // if (revokeToken) {
        //     throw new BadRequestException("invalid token Revoked")
        // }
        return { user, decoded }
    }
}

export default TokenService