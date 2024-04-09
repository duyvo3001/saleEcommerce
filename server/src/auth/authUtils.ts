import  jwt from "jsonwebtoken"

const createTokenPair = async (payload : {}, publicKey : string, privateKey : string ) => {
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
        //
        jwt.verify(payload.toString(), privateKey,(err,decode)=>{
            if(err) console.log(`error verify`,err)
            else console.log(`decode verify`,decode)
        })
        return {accessToken, refreshToken}
    } catch (error) {
        
    }
}

export default createTokenPair

