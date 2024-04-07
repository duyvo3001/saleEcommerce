import shopModel from "../models/shop.model"
import bcrypt from "bcrypt"
import { generateKeyPairSync } from "crypto"
import keyTokenService from "./keyToken.service";
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
interface SignUpParams {
    name: string;
    email: string;
    password: string;
    roles: []; // Assuming roles is an array of strings, adjust if necessary
}
interface User {
    userID: string,
    publicKey: string
}
class AccessService {
    signUp = async ({ name, email, password, roles }: SignUpParams) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop) {
                return {
                    code: '20002',
                    message: 'Shop already exists'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {//create prikey and pubkey
                const { privateKey, publicKey } = generateKeyPairSync('rsa', {
                    modulusLength: 2048,  // the length of your key in bits
                });
                console.log(privateKey, publicKey)

                const publicKeyString =  await keyTokenService.createKeyToken({
                    userID : newShop._id.toString() , 
                    publicKey : publicKey.toString()
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    }
                }

                const token  = await keyTokenService()
            }
        } catch (error: any) {
            return {
                code: '20001',
                message: error.message,
                status: 'error',
            }
        }
    }
}

export default new AccessService()