import { Request, Response, NextFunction } from "express"
import { asyncHandler } from "../helpers/asyncHandler"
import jwt from "jsonwebtoken"
import { AuthFailedError, NotFoundError } from "../core/error.response"
import keyTokenService from "../services/keyToken.service"

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    objKey: 'objKey'
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
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userId || "") throw new AuthFailedError('invalid Request')

    //#2
    const keyStore = await keyTokenService.findByUserID(userId)
    
    if (!keyStore || "") throw new NotFoundError('Not found keystore')

    //#3 
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    console.log("accessToken~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",accessToken);
    
    if (!accessToken || "") throw new AuthFailedError('invalid Request')

    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser) throw new AuthFailedError('invalid userId')
        // req.keyStore = keyStore 
        return next()
    } catch (error) {
        throw error
    }

})


