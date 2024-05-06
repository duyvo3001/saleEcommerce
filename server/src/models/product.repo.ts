import { Types } from "mongoose";
import { ProductModels } from "./product.model";
import { populate } from "dotenv";

interface InterfaceFindProduct {
    query: {},
    limit: number,
    skip: number
}
export const findAllDraftsForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return queryProduct({ query, limit, skip })
}

export const findAllPublishForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return queryProduct({ query, limit, skip })
}
const queryProduct = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return await ProductModels.find(query)
        .populate('product_shop', 'name email - id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}
export const publishProductByShopRepo = async ({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: Types.ObjectId }) => {
    const foundShop = await ProductModels.findOne({
        product_shop,
        _id: product_id
    })
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublish = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

