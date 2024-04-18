import { keytokenModel } from "../models/keytoken.model"

interface User {
    userID: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string
}
class KeyTokenService {
    createKeyToken = async ({ userID, publicKey, privateKey, refreshToken }: User) => {
        try {
            const filter = { user: userID }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upset: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }
}

export default new KeyTokenService()

