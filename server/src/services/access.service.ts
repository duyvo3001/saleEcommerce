import bcrypt from "bcrypt"
import { KeyTokenService } from "./keyToken.service";
import { shopModel } from "../models/shop.model";
import { generateKeyPairSync } from "crypto"
import { createTokenPair, verifyJWT } from "../auth/authUtils";
import { AuthFailedError, BadRequestError, ForbiddenError } from "../core/error.response";
import { findByEmail } from "./shop.service";
import { Request } from "express"
import { handlerTokenParams, HEADER, LoginParams, SignUpParams, RoleShop, Iaccount_lock } from "./interface/Iaccess";
import { logger } from "../utils/Logger";
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

export class AccessService {
    /*
        TODO check this token used
    */
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }: handlerTokenParams) => {

        const { userID, email } = JSON.parse(user)
        const _KeyStore = JSON.parse(keyStore)

        logger.info(`Attempting to refresh token for user: ${userID}`); // Log the attempt

        if (_KeyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userID)
            logger.warn(`Refresh token already used for user: ${userID}`); // Log the warning
            throw new ForbiddenError('Something went wrong ! Please relogin')
        }

        if (_KeyStore.refreshToken !== refreshToken) {
            logger.error(`Invalid refresh token for user: ${userID}`); // Log the error
            throw new AuthFailedError('Shop not Registered 1')
        }

        let select = {}
        const foundShop = await findByEmail({ email, select })
        if (!foundShop) {
            logger.error(`Shop not found for email: ${email}`); // Log the error
            throw new AuthFailedError('Shop not Registered 2')
        }

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

        logger.info(`Successfully refreshed token for user: ${userID}`); // Log the success

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

        logger.info(`Login attempt for email: ${email}`); // Log the login attempt
        let select = {}

        const foundShop = await findByEmail({ email, select })//1
        if (!foundShop) {
            logger.warn(`Login failed for email: ${email} - Shop not registered`); // Log the failure  
            throw new BadRequestError(`shop not Registered`)
        }

        if (foundShop.isLocked == true) {
            logger.warn(`Login attempt for locked account: ${email}`); // Log the locked account attempt
            throw new ForbiddenError(`Account is locked due to multiple failed login attempts`)
        }

        const match = await bcrypt.compare(password, foundShop.password)//2

        AccessService.account_lock({ foundShop, match, email })

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

        logger.info(`Login successful for user: ${foundShop._id}`); // Log the success
        return {
            shop: foundShop, tokens
        }
    }

    static loginTwo_factor_authentication = async () => {
        return {}
    }

    static account_lock = async ({ foundShop, match, email }: Iaccount_lock) => {
        if (!match) {
            foundShop.failedLoginAttempts += 1;
            if (foundShop.failedLoginAttempts >= 3) {
                foundShop.isLocked = true;
                logger.warn(`Account locked due to multiple failed login attempts: ${email}`); // Log the account lock
            }
            shopModel.updateOne({ email }, { failedLoginAttempts: foundShop.failedLoginAttempts }).exec();

            logger.warn(`Login failed for email: ${email} - Authentication failed`); // Log the failure
            throw new AuthFailedError(`Authentication Failed`)
        }

        // Reset failed login attempts on successful login
        shopModel.updateOne({ email }, { failedLoginAttempts: 0 }).exec();

    }

    static account_unlock = async () => {

    }
    static forgot_password = async () => { }

    static signUp_third_party = async (idToken: string) => {
  
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '220054696236-nsgi4ko2m05vd2ie0t8qjg5nts7ajage.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new AuthFailedError('Invalid Google token');
        }

        const { email, name, sub: googleId } = payload;

        let foundShop = await shopModel.findOne({ email }).lean();

        if (foundShop) {
            throw new BadRequestError('Error: Shop already Registered')
        }

        // If the user does not exist, create a new user
        const newShop = await shopModel.create({
            name,
            email,
            password: '', // No password for third-party sign-up
            roles: [RoleShop.SHOP],
            googleId
        });

        if (newShop) {
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
                userID: newShop.id.toString(),
                publicKey: publicKey.toString(),
                privateKey: privateKey.toString(),
                refreshToken: ""
            });

            if (!publicKeyString) {
                return {
                    code: 'xxxx',
                    message: 'publicKeyString error'
                };
            }

            const tokens = await createTokenPair(
                { userID: newShop._id, email },
                publicKeyString.toString(),
                privateKey.toString()
            );

            if (!tokens) {
                return {
                    code: 'xxxx',
                    message: 'tokens error'
                };
            }

            return {
                code: 201,
                metadata: {
                    shop: newShop,
                    tokens
                }
            };
        }

        return {
            code: 202,
            metadata: null
        };
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
                userID: newShop.id.toString(),
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
