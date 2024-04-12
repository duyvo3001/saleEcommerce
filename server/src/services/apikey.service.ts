
import { apikeyModel } from "../models/apikey.model"

export const findById = async (key: string) => {
    // const newKey = await apikeyModel.create(
    //     { key: randomBytes(64).toString('hex'), status: true, permissions: ['0000'] }
    // )
    // console.log('hello_______________-------', newKey)
    const objKey = await apikeyModel.findOne({ key, status: true }).lean()
    return objKey
}
