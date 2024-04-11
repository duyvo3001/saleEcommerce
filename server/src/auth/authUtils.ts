import jwt from "jsonwebtoken"

export const createTokenPair = async (payload: {}, publicKey: string, privateKey: string) => {
    try {
        console.log('hell0_______' ,payload,`publicKey_______`,publicKey,`privateKey__________`,privateKey)
        // accesstoken
        const accessToken: string = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h'
        })

        const refreshToken: string = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '12h'
        })
        console.log(`Access token: ${accessToken} --------------- refresh tokenn: ${refreshToken}`)
        //
        jwt.verify(payload.toString(), publicKey, (err, decode) => {
            if (err) console.log(`error verify`, err)
            else console.log(`decode verify`, decode)
        })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}



