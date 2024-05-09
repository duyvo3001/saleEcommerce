import { ProductModels } from "../../models/product.model"
import { Types } from "mongoose";

export interface InterfaceFindProduct {
    query: {},
    limit: number,
    skip: number
}
export const queryProduct = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return await ProductModels.find(query)
        .populate('product_shop', 'name email - id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

export const queryUn_Or_publishProduct = async ({ product_shop, product_id, isDraft, isPublish }:
    { product_shop: Types.ObjectId, product_id: Types.ObjectId, isDraft: Boolean, isPublish: Boolean }) => {
    const foundShop = await ProductModels.findOne({
        product_shop,
        _id: product_id,

    })
    if (!foundShop) return null;

    foundShop.isDraft = isDraft;
    foundShop.isPublish = isPublish;
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}