import { keytokenModel } from "../models/keytoken.model"
import { Types } from "mongoose"
interface User {
    userID: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string
}
type updateToken = {
    refreshToken: string, refreshTokensUsed: string, userID: string
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

    findRefreshTokenUsed = async (refreshToken: string) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    findRefreshToken = async (refreshToken: string) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }

    deleteKeyById = async (userId: string) => {
        return await keytokenModel.deleteOne({ user: userId })
    }

    updateRefreshToken = async ({ refreshToken, refreshTokensUsed, userID }: updateToken) => {
        const filter = { user: new Types.ObjectId(userID) }
        const update = {
            $set: { refreshToken },
            $addToSet: { refreshTokensUsed }// was used to get new token
        }
        return await keytokenModel.updateOne(filter,update)
    }

}

export default new KeyTokenService()

