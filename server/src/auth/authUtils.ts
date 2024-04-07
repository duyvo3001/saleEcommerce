import  jwt from "jsonwebtoken"
interface CreateToken {
    payload: string,
    publicKey: string,
    privateKey: string
}
const createTokenPair = async ({ payload, publicKey, privateKey }: CreateToken) => {
    try {
        // accesstoken
        const accessToken = await jwt.sign(payload, privateKey,{
            algorithm: 'RS256',
            expiresIn: "7 days"
        })

        const refreshToken = await jwt.sign(payload, privateKey,{
            algorithm: 'RS256',
            expiresIn: "7 days"
        })

        return {accessToken, refreshToken}
    } catch (error) {
        
    }
}


