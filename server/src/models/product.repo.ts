import { Types } from "mongoose";
import { ProductModels } from "./product.model";
import { populate } from "dotenv";

interface InterfaceFindProduct {
    query: {},
    limit: number,
    skip: number
}
export const findAllDraftsForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return await ProductModels.find(query)
        .populate('product_shop','name email - id')
        .sort({updateAt :-1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}