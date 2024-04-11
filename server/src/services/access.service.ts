import { shopModel } from "../models/shop.model";
import bcrypt from "bcrypt"
import { generateKeyPairSync } from "crypto"
import keyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
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
                    modulusLength: 4096,
                    publicKeyEncoding: {
                      type: 'spki',
                      format: 'pem'
                    },
                    privateKeyEncoding: {
                      type: 'pkcs8',
                      format: 'pem'
                    }
                });

                const publicKeyString = await keyTokenService.createKeyToken({
                    userID: newShop._id.toString(),
                    publicKey: publicKey.toString()
                })

                if (!publicKeyString || publicKeyString == undefined) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    }
                }
                //create token pair 
                const tokens = await createTokenPair(
                    {
                        userID: newShop._id, email
                    },
                    publicKey.toString(),
                    privateKey.toString()
                )
                console.log(`____________token` , tokens)
                if (!tokens || tokens == undefined) {
                    return {
                        code: 'xxxx',
                        message: 'tokens error'
                    }
                }
                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
            }
            return {
                code: 202,
                metadata: null
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