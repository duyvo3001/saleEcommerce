import { keytokenModel } from "../models/keytoken.model"

interface User {
    userID: string,
    publicKey: string
}
class KeyTokenService {
    createKeyToken = async ({ userID, publicKey }: User) => {
        try {
            const publicKeyString = publicKey.toString();
       
            const tokens = await keytokenModel.create({
                user: userID , 
                publicKey: publicKeyString
            })
            
            return tokens ? publicKeyString : null
        } catch (error) {
            console.log('error publicKeyString' , error)
            return error
        }
    }
}

export default new KeyTokenService()

