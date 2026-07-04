import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { TokenEnum } from "../enum/token.enum.js"
import { RoleEnum } from "../enum/user.enum.js"
import { AuthorizationGuard } from "../guards/authorization.guards.js"
import { AuthenticationGuard } from "../guards/authentication.guards.js"
import { Token } from "./token.decorator.js"
import { Role } from "./roles.decorator.js"


export function Auth({
    tokenType=TokenEnum.access_token,
    role=[RoleEnum.user]
}: {
    tokenType?: TokenEnum,
    role?: RoleEnum[]
}={}) {
    return applyDecorators(
        Token(tokenType),
        Role(role),
        UseGuards(AuthenticationGuard, AuthorizationGuard)
    )
}