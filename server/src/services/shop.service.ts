import { shopModel } from "../models/shop.model"
interface IfindEmail {
    email: string;
    select: {}
}
export const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, roles: 1
} }: IfindEmail) => {
    return await shopModel.findOne({ email }).select(select).lean()
}