import { keytokenModel } from "../models/keytoken.model"

interface User {
    userID: string,
    publicKey: string
}
class KeyTokenService {
    createKeyToken = async ({ userID, publicKey }: User) => {
        try {
            const publicKeyString = publicKey.toString();
            console.log('publicKeyString ,userID :',publicKeyString ,userID);
            console.log('keytokenModel',keytokenModel)
            const tokens = await keytokenModel.create({
                user: userID , 
                publicKey: publicKeyString
            })
            
            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }
}

export default new KeyTokenService()

