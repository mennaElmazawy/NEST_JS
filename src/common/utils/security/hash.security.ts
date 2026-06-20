
import { hashSync, compareSync } from "bcrypt";



export const Hash= ({plainText,salt_Rounds=Number(process.env.SALT_ROUNDS!)}:{plainText:string,salt_Rounds?:number}):string => {

    return hashSync(plainText.toString(), Number(salt_Rounds))
}

export const Compare= ({plainText, cipherText}:{plainText:string,cipherText:string}):boolean => {

    return compareSync(plainText, cipherText)
}