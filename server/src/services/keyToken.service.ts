import { keytokenModel } from "../models/keytoken.model"
import { Types } from "mongoose"
import { User, updateToken } from "./interface/IkeyUser"
export class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey, refreshToken }: User) => {
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

    static findByUserID = async (userId: string) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyById = async (id: string) => { 
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }

    static findRefreshTokenUsed = async (refreshToken: string) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findRefreshToken = async (refreshToken: string) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }

    static deleteKeyById = async (userId: string) => {
        return await keytokenModel.deleteOne({ user: userId })
    }

    static updateRefreshToken = async ({ refreshToken, refreshTokensUsed, userID }: updateToken) => {
        const filter = { user: new Types.ObjectId(userID) }
        const update = {
            $set: { refreshToken },
            $addToSet: { refreshTokensUsed }// was used to get new token
        }
        return await keytokenModel.updateOne(filter,update)
    }

}


