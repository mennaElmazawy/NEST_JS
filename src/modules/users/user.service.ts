import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import UserRepository from "../../DB/repository/user.repositories.js";
import { CreateUserDto, signInDto } from "./userDto/user.dto.js";
import { encrypt } from "../../common/utils/security/encrypt.security.js";
import { generateOTP, sendEmail } from "../../common/utils/email/sendEmail.service.js";
import { emailTemplate } from "../../common/utils/email/email.template.js";
import { eventEmitter } from "../../common/utils/email/email.events.js";
import { emailEnum } from "../../common/enum/email.enum.js";
import RedisService from "../../common/service/redis.service.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { randomUUID } from "node:crypto";
import TokenService from "../../common/service/token.services.js";
import { S3Service } from "../../common/service/s3service.js";



@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly redisService: RedisService,
        private readonly tokenService: TokenService,
        private readonly S3Service: S3Service,
    ) { }

    async getUsers() {
        return await this.userRepository.find()
    }

    async SignUp(body: CreateUserDto) {
        const { userName, email, password, cPassword, age, phone, } = body
        const emailExist = await this.userRepository.findOne({
            filter: { email }
        })
        if (emailExist) {
            throw new ConflictException("email already exist")
        }
        const otp = await generateOTP();
        eventEmitter.emit(emailEnum.confirmEmail, async () => {
            await sendEmail({
                to: email,
                subject: emailEnum.confirmEmail,
                html: emailTemplate(otp)
            });
            await this.redisService.setValue({ key: this.redisService.otp_key({ email, subject: emailEnum.confirmEmail }), value: Hash({ plainText: `${otp}` }), ttl: 60 })
            await this.redisService.incr(this.redisService.max_otp_key({ email, subject: emailEnum.confirmEmail }))

        })
        const user = await this.userRepository.create({
            userName,
            email,
            password,
            age,
            phone: encrypt(phone)
        })

        return user
    }


    async signIn(body: signInDto) {
        const { email, password, }: signInDto = body;
        const user = await this.userRepository.findOne({
            filter: {
                email
            }
        })
        if (!user) {
            throw new BadRequestException("user not exist")
        }

        if (!Compare({ plainText: password, cipherText: user.password })) {
            throw new BadRequestException("invalid password")
        }

        const jwtid = randomUUID();
        const access_token = await this.tokenService.GenerateToken({
            payload: { id: user._id, email: user.email, role: user.role },
            options: {
                secret: process.env.ACCESS_SECRET_KEY!,
                expiresIn: "1h",
                jwtid
            }
        })
        const refresh_token = await this.tokenService.GenerateToken({
            payload: { id: user._id, email: user.email, role: user.role },
            options: {
                secret: process.env.REFRESH_SECRET_KEY!,
                expiresIn: "1y",
                jwtid
            }
        })
        return { access_token, refresh_token }
    }

    async uploadProfileImage(file: Express.Multer.File) {
        return this.S3Service.uploadFile({ file, path: "profile" })
    }
}