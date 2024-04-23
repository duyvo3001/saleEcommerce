import { keytokenModel } from "../models/keytoken.model"
import { Types } from "mongoose"
interface User {
    userID: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string
}
class KeyTokenService {
    createKeyToken = async ({ userID, publicKey, privateKey, refreshToken }: User) => {
        try {
            const update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }
            const filter = { user: userID }
            const options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    findByUserID = async (userId: string) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    removeKeyById = async (id: string) => {
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }

}

export default new KeyTokenService()

