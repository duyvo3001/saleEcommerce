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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilioClient = twilio(process.env.accountSidTWILIO, process.env.authTokenTWILIO);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

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

    static account_unlock = async ({ email, unlockCode }: { email: string; unlockCode: string }) => {
        try {
            logger.info(`Attempting to unlock account for email: ${email}`);
            
            // Find the shop by email
            const foundShop = await shopModel.findOne({ email }).lean();
            
            if (!foundShop) {
                logger.warn(`Account unlock attempt for non-existent email: ${email}`);
                throw new BadRequestError('Account not found');
            }

            // Check if account is actually locked
            if (!foundShop.isLocked) {
                logger.info(`Account unlock attempt for already unlocked account: ${email}`);
                throw new BadRequestError('Account is not locked');
            }

            // Verify the unlock code
            if (foundShop.unlockCode !== unlockCode) {
                logger.warn(`Invalid unlock code attempt for account: ${email}`);
                throw new AuthFailedError('Invalid unlock code');
            }

            // Reset account lock status and failed attempts
            const updatedShop = await shopModel.findByIdAndUpdate(
                foundShop._id,
                {
                    isLocked: false,
                    failedLoginAttempts: 0,
                    unlockCode: null // Clear the unlock code after successful use
                },
                { new: true }
            ).lean();

            if (!updatedShop) {
                logger.error(`Failed to update account unlock status for: ${email}`);
                throw new BadRequestError('Failed to unlock account');
            }

            logger.info(`Successfully unlocked account for: ${email}`);
            return {
                message: 'Account unlocked successfully',
                shop: updatedShop
            };
        } catch (error: any) {
            logger.error(`Account unlock failed: ${error.message}`);
            throw error;
        }
    }

    static forgot_password = async ({ email, phone }: { email: string; phone: string }) => {
        try {
            logger.info(`Attempting password reset for email: ${email}`);
            
            // Find the shop by email
            const foundShop = await shopModel.findOne({ email }).lean();
            
            if (!foundShop) {
                logger.warn(`Password reset attempt for non-existent email: ${email}`);
                throw new BadRequestError('Account not found');
            }

            // Verify phone number matches
            if (foundShop.phone !== phone) {
                logger.warn(`Password reset attempt with incorrect phone number for email: ${email}`);
                throw new BadRequestError('Phone number does not match account');
            }

            // Generate reset code
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Save reset code to user's record
            await shopModel.findByIdAndUpdate(
                foundShop._id,
                { 
                    resetCode,
                    resetCodeExpires: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry
                }
            );

            // Send reset code via email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Code',
                text: `Your password reset code is: ${resetCode}. This code will expire in 15 minutes.`
            });

            // Send reset code via SMS
            await twilioClient.messages.create({
                body: `Your password reset code is: ${resetCode}. This code will expire in 15 minutes.`,
                to: phone,
                from: process.env.TWILIO_PHONE_NUMBER
            });

            logger.info(`Reset code sent successfully to: ${email}`);
            return {
                message: 'Reset code sent successfully'
            };
        } catch (error: any) {
            logger.error(`Password reset failed: ${error.message}`);
            throw error;
        }
    }

    static verify_reset_code = async ({ email, resetCode }: { email: string; resetCode: string }) => {
        try {
            logger.info(`Verifying reset code for email: ${email}`);
            
            const foundShop = await shopModel.findOne({ 
                email,
                resetCode,
                resetCodeExpires: { $gt: Date.now() }
            }).lean();
            
            if (!foundShop) {
                logger.warn(`Invalid or expired reset code for email: ${email}`);
                throw new BadRequestError('Invalid or expired reset code');
            }

            logger.info(`Reset code verified successfully for: ${email}`);
            return {
                message: 'Reset code verified successfully'
            };
        } catch (error: any) {
            logger.error(`Reset code verification failed: ${error.message}`);
            throw error;
        }
    }

    static reset_password = async ({ email, resetCode, newPassword }: { email: string; resetCode: string; newPassword: string }) => {
        try {
            logger.info(`Attempting password reset for email: ${email}`);
            
            const foundShop = await shopModel.findOne({ 
                email,
                resetCode,
                resetCodeExpires: { $gt: Date.now() }
            }).lean();
            
            if (!foundShop) {
                logger.warn(`Invalid or expired reset code for email: ${email}`);
                throw new BadRequestError('Invalid or expired reset code');
            }

            // Hash new password
            const passwordHash = await bcrypt.hash(newPassword, 10);

            // Update password and clear reset code
            const updatedShop = await shopModel.findByIdAndUpdate(
                foundShop._id,
                { 
                    password: passwordHash,
                    resetCode: null,
                    resetCodeExpires: null
                },
                { new: true }
            ).lean();

            if (!updatedShop) {
                logger.error(`Failed to update password for: ${email}`);
                throw new BadRequestError('Failed to reset password');
            }

            logger.info(`Password reset successful for: ${email}`);
            return {
                message: 'Password reset successful'
            };
        } catch (error: any) {
            logger.error(`Password reset failed: ${error.message}`);
            throw error;
        }
    }

    static login_third_party = async (idToken: string) => {
        try {
            logger.info('Attempting Google OAuth2 login');
            
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if (!payload) {
                logger.error('Invalid Google token payload');
                throw new AuthFailedError('Invalid Google token');
            }

            const { email, name, sub: googleId } = payload;

            // Find existing user
            let foundShop = await shopModel.findOne({ 
                $or: [
                    { email },
                    { googleId }
                ]
            }).lean();

            if (foundShop) {
                // If user exists but hasn't linked Google account
                if (!foundShop.googleId) {
                    const updatedShop = await shopModel.findByIdAndUpdate(
                        foundShop._id,
                        { 
                            googleId,
                            authProvider: 'google'
                        },
                        { new: true }
                    ).lean();

                    if (!updatedShop) {
                        throw new AuthFailedError('Failed to update user with Google account');
                    }
                    foundShop = updatedShop;
                }

                // Generate tokens for existing user
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

                const tokens = await createTokenPair(
                    { userID: foundShop._id, email },
                    publicKey,
                    privateKey
                );

                await KeyTokenService.createKeyToken({
                    userID: foundShop._id,
                    privateKey,
                    publicKey,
                    refreshToken: tokens.refreshToken
                });

                logger.info(`Google login successful for user: ${foundShop._id}`);
                return {
                    shop: foundShop,
                    tokens
                };
            }

            // If user doesn't exist, create new account
            return await AccessService.signUp_third_party(idToken);
        } catch (error: any) {
            logger.error(`Google login failed: ${error.message}`);
            throw new AuthFailedError('Google authentication failed');
        }
    }

    static signUp_third_party = async (idToken: string) => {
        try {
            logger.info('Attempting Google OAuth2 signup');
            
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if (!payload) {
                logger.error('Invalid Google token payload');
                throw new AuthFailedError('Invalid Google token');
            }

            const { email, name, sub: googleId } = payload;

            // Check if user already exists
            let foundShop = await shopModel.findOne({ 
                $or: [
                    { email },
                    { googleId }
                ]
            }).lean();

            if (foundShop) {
                logger.warn(`User already exists with email: ${email}`);
                throw new BadRequestError('User already registered');
            }

            // Create new user
            const newShop = await shopModel.create({
                name,
                email,
                password: '', // No password for third-party sign-up
                roles: [RoleShop.SHOP],
                googleId,
                authProvider: 'google',
                status: 'active',
                verrify: true // Google accounts are pre-verified
            });

            if (newShop) {
                const tokens = await AccessService.createTokenPair(newShop, email);
                logger.info(`Google signup successful for user: ${newShop._id}`);
                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                };
            }

            logger.error('Failed to create new shop account');
            return {
                code: 202,
                metadata: null
            };
        } catch (error: any) {
            logger.error(`Google signup failed: ${error.message}`);
            throw error;
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
            const tokens = await AccessService.createTokenPair(newShop, email)
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

    static createTokenPair = async (newShop: any, email: any) => {
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

        return tokens
    }

}
