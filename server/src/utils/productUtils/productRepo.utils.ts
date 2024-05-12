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

export const getSelectData = (select: string[] = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

export const unGetSelectData = (select: string[] = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

export const removeUndefindObject = (obj: any): any => {
    console.log(obj);

    Object.keys(obj).forEach(el => {
        if (obj[el] === null || obj[el] === undefined) {
            delete obj[el]
        }
    })
    return obj
}

export const updateNestedObject = (obj: any): any => {
    const final: any = {}
    Object.keys(obj).forEach((el: any): any => {
        if (typeof obj[el] === 'object' && !Array.isArray(obj[el])) {
            const response = updateNestedObject(obj[el])
            Object.keys(response).forEach((elFinal: any): any => {
                elFinal[`${el}.${elFinal}`] = response[elFinal]
            })
        }
        else final[el] = obj[el]
    })
    return final
}