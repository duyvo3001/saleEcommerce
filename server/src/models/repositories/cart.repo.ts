import { Types } from "mongoose";
import { cartModel } from "../cart.model";

export const findCartById = async (cartId : Types.ObjectId) =>{
    return await cartModel.findOne({
        _id : cartId , cart_state : "active"
    }).lean()
}