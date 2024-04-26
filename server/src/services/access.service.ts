import bcrypt from "bcrypt"
import keyTokenService from "./keyToken.service";

import { shopModel } from "../models/shop.model";
import { generateKeyPairSync } from "crypto"
import { createTokenPair, verifyJWT } from "../auth/authUtils";
import { AuthFailedError, BadRequestError, ForbiddenError } from "../core/error.response";
import { findByEmail } from "./shop.service";
import { Types } from 'mongoose';
import { NextFunction, Request, Response } from "express"

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
type updateToken = {
    refreshToken: string, refreshTokensUsed: string, userId: string
}
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    keyStore: 'keyStore'
}
type handlerTokenParams = {
    refreshToken: string,
    user: {
        userID: string,
        email: string
    }
    keyStore: string
}
class AccessService {
    /*
        TODO check this token used
    */
    handlerRefreshToken = async ({ refreshToken, user, keyStore }: handlerTokenParams) => {
        const foundToken = await keyTokenService.findRefreshTokenUsed(refreshToken)

        if (foundToken) {
            /*
                TODO: who used token
            */
            const { userID, email } = await verifyJWT(refreshToken, foundToken.privateKey) as { userID: string, email: string };
            /*
                !delete userid in keytokens
                TODO in future at func handle this to email
            */
            await keyTokenService.deleteKeyById(userID)
            //
            throw new ForbiddenError('Something went wrong ! Please relogin')

        }
        /* 
            * if dont have a token
        */
        const holderToken = await keyTokenService.findRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailedError('Shop not Registered')

        /* 
            * verify token
        */
        const { userID, email } = await verifyJWT(refreshToken, holderToken.privateKey) as { userID: string, email: string };

        /* 
            * check userId 
        */
        let select = {}
        const foundShop = await findByEmail({ email, select })
        if (!foundShop) throw new AuthFailedError('Shop not Registered')

        /*
            * create new token  
        */
        const tokens = await createTokenPair({ userID, email }, holderToken.publicKey, holderToken.privateKey)

        /*
            ? update token
        */

        await keyTokenService.updateRefreshToken(
            { refreshToken: tokens.refreshToken, refreshTokensUsed: refreshToken, userID }
        )

        return {
            user: { userID, email },
            tokens
        }
    }

    logout = async (keyStore: Request) => {
        const id: string = keyStore.headers[HEADER.keyStore]?.toString() || ""
        // console.log(keyStore.headers[HEADER.keyStore]);

        //1_ check email
        //2_ match pass
        //3_ create At and rt and save 
        //4_ generate tokens
        //5_ get data return login

        await keyTokenService.removeKeyById(id) // remove id from key store

        // return delKey
        return {
            message: "logout success"
        }
    }

    login = async ({ email, password, refreshToken }: LoginParams) => {
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

        await keyTokenService.createKeyToken({
            userID: foundShop._id,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken
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