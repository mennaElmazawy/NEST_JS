import { SetMetadata } from "@nestjs/common"
import { RoleEnum } from "../enum/user.enum.js"

export const role_key ="role_key"

export const Role = (role:RoleEnum[]) => {
    return SetMetadata(role_key,role)
}