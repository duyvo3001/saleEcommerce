import { shopModel } from "../models/shop.model";
import bcrypt from "bcrypt"
import { generateKeyPairSync } from "crypto"
import keyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { AuthFailedError, BadRequestError } from "../core/error.response";
import { findByEmail } from "./shop.service";

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
interface LoginParams {
    password: string;
    refreshToken: string;
    email: string;
}

class AccessService {

    //1_ check email
    //2_ match pass
    //3_ create At and rt and save 
    //4_ generate tokens
    //5_ get data return login
    login = async ({ email, password, refreshToken }: LoginParams) => {
        let select = {}
        console.log(email, password, refreshToken)
        const foundShop = await findByEmail({ email, select })//1
        if (!foundShop) throw new BadRequestError(`shop not Registered`)

        const match = await bcrypt.compare(password, foundShop.password)//2

        if (match == false || !match) throw new AuthFailedError(`Authentication Failed`)

        const { privateKey, publicKey } = generateKeyPairSync('rsa', {//3
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

        const tokens = await createTokenPair(//4
            {
                userID: foundShop._id, email
            },
            privateKey, publicKey
        )

        await keyTokenService.createKeyToken({
            userID: "",
            refreshToken: " ",
            privateKey, publicKey
        })
        return {
            shop: foundShop, tokens
        }
    }

    signUp = async ({ name, email, password, roles }: SignUpParams) => {

        const holderShop = await shopModel.findOne({ email }).lean() // find shop 

        if (holderShop) {
            throw new BadRequestError('Error: Shop already Registered')
        }
        const passwordHash = await bcrypt.hash(password, 10) // hash pass

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
                publicKey: publicKey.toString(),
                privateKey: privateKey.toString(),
                refreshToken: ""
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
                publicKeyString.toString(),
                privateKey.toString()
            )

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
    }
}

export default new AccessService()