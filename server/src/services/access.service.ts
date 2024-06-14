import bcrypt from "bcrypt"
import { KeyTokenService } from "./keyToken.service";
import { shopModel } from "../models/shop.model";
import { generateKeyPairSync } from "crypto"
import { createTokenPair, verifyJWT } from "../auth/authUtils";
import { AuthFailedError, BadRequestError, ForbiddenError } from "../core/error.response";
import { findByEmail } from "./shop.service";
import { Request } from "express"
import { handlerTokenParams, HEADER, LoginParams, SignUpParams, RoleShop } from "./interface/Iaccess";

export class AccessService {
    /*
        TODO check this token used
    */
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }: handlerTokenParams) => {

        const { userID, email } = JSON.parse(user)
        const _KeyStore = JSON.parse(keyStore)

        if (_KeyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userID)
            throw new ForbiddenError('Something went wrong ! Please relogin')
        }

        if (_KeyStore.refreshToken !== refreshToken) {
            throw new AuthFailedError('Shop not Registered 1')
        }

        let select = {}
        const foundShop = await findByEmail({ email, select })
        if (!foundShop) throw new AuthFailedError('Shop not Registered 2')

        /*
            * create new token  
        */
        const tokens = await createTokenPair({ userID, email }, _KeyStore.publicKey, _KeyStore.privateKey)

        /*
            ? update token
        */

        await KeyTokenService.updateRefreshToken(
            { refreshToken: tokens.refreshToken, refreshTokensUsed: refreshToken, userID }
        )

        return {
            user: { userID, email },
            tokens
        }
    }

    static logout = async (keyStore: Request) => {
        const id: string = keyStore.headers[HEADER.keyStore]?.toString() || ""

        await KeyTokenService.removeKeyById(id) // remove id from key store

        // return delKey
        return {
            message: "logout success"
        }
    }

    static login = async ({ email, password, refreshToken }: LoginParams) => {
        let select = {}

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
            publicKey, privateKey,
        )

        await KeyTokenService.createKeyToken({
            userID: foundShop._id,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken
        })

        return {
            shop: foundShop, tokens
        }
    }

    static signUp = async ({ name, email, password, roles }: SignUpParams) => {

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

            const publicKeyString = await KeyTokenService.createKeyToken({
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

// export default new AccessService()