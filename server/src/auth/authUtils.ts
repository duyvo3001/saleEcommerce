import jwt from "jsonwebtoken"

export const createTokenPair = async (payload: {}, publicKey: string, privateKey: string) => {
    try {
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
    } catch (error) {

    }
}



