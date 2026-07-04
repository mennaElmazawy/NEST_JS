import { SetMetadata } from "@nestjs/common"
import { TokenEnum } from "../enum/token.enum.js"


export const token_key ="token_key"

export const Token = (tokenType: TokenEnum=TokenEnum.access_token) => {
    return SetMetadata(token_key,tokenType)
}