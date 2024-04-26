import { Request, Response, NextFunction } from "express"
import { asyncHandler } from "../helpers/asyncHandler"
import jwt from "jsonwebtoken"
import { AuthFailedError, NotFoundError } from "../core/error.response"
import keyTokenService from "../services/keyToken.service"

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    keyStore: 'keyStore',
    REFRESHTOKEN: "refreshtoken",
    user:'user'
}
interface UserIDJwtPayload extends jwt.JwtPayload {
    userID: string
}
export const createTokenPair = async (payload: {}, publicKey: string, privateKey: string) => {

    // accesstoken 
    const accessToken: string = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h'
    })

    // refreshtoken 
    const refreshToken: string = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '12h'
    })

    jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err)
            console.log(`error verify`, err)
        else
            console.log(`decode verify`, decode)
    })
    return { accessToken, refreshToken }
}

// export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     /*
//         1 - check userId missing 
//         2 - get accessToken 
//         3 - verify Token
//         4 - check user in db 
//         5 - check keyStore with this userId
//         6 - ok all  => return next()
//     */
//     //#1
//     const userIdREQ = req.headers[HEADER.CLIENT_ID]?.toString()
//     if (!userIdREQ || "") throw new AuthFailedError('invalid Request')

//     //#2
//     const keyStore = await keyTokenService.findByUserID(userIdREQ)

//     if (!keyStore || "") throw new NotFoundError('Not found keystore')

//     //#3 
//     const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()

//     if (!accessToken || "") throw new AuthFailedError('invalid Request')

//     try {//#4
//         const User: UserIDJwtPayload = jwt.verify(accessToken, keyStore.publicKey) as UserIDJwtPayload

//         if (userIdREQ !== User.userID) throw new AuthFailedError('invalid userId')//#5

//         req.headers[HEADER.keyStore] = keyStore?._id
//         return next()//#6
//     } catch (error) {
//         throw error
//     }

// })

export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    /*
        1 - check userId missing 
        2 - get accessToken 
        3 - verify Token
        4 - check user in db 
        5 - check keyStore with this userId
        6 - ok all  => return next()
    */
    //#1
    const userIdREQ = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userIdREQ || "") throw new AuthFailedError('invalid Request')

    //#2
    const keyStore = await keyTokenService.findByUserID(userIdREQ)

    if (!keyStore || "") throw new NotFoundError('Not found keystore')

    //#3S
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]?.toString()
    if (refreshToken) {
        try {
            const DecodeUser: UserIDJwtPayload = jwt.verify(refreshToken, keyStore.privateKey) as UserIDJwtPayload

            if (userIdREQ !== DecodeUser.userID) throw new AuthFailedError('invalid userId')//#5

            req.headers[HEADER.keyStore] = keyStore?._id
            req.headers[HEADER.REFRESHTOKEN] = keyStore?.refreshToken
            req.headers[HEADER.user] = DecodeUser.toString()
            return next()//#6
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()

    if (!accessToken || "") throw new AuthFailedError('invalid Request')

    try {//#4
        const User: UserIDJwtPayload = jwt.verify(accessToken, keyStore.publicKey) as UserIDJwtPayload

        if (userIdREQ !== User.userID) throw new AuthFailedError('invalid userId')//#5

        req.headers[HEADER.keyStore] = keyStore?._id
        return next()//#6
    } catch (error) {
        throw error
    }

})

export const verifyJWT = async (token: string, keySecret: string) => {
    return await jwt.verify(token, keySecret)
}
