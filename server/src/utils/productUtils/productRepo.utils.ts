import { ProductModels } from "../../models/product.model"
import { Types } from "mongoose";

interface InterfaceFindProduct {
    query: {},
    limit: number,
    skip: number
}
interface IpublishProduct {
    product_shop: Types.ObjectId;
    product_id: Types.ObjectId;
    isDraft: Boolean;
    isPublish: Boolean;
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


const queryUn_Or_publishProduct = async ({ product_shop, product_id, isDraft, isPublish }: IpublishProduct) => {

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

const getSelectData = (select: string[] = []) => Object.fromEntries(select.map(el => [el, 1]))


const unGetSelectData = (select: string[] = []) => Object.fromEntries(select.map(el => [el, 0]))


const removeUndefindObject = (obj: any): any => {

    Object.keys(obj).forEach(el => {
        if (obj[el] === null || obj[el] === undefined) {
            delete obj[el]
        }
    })
    return obj
}

const updateNestedObject = (obj: any): any => {
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
export {
    InterfaceFindProduct,
    queryProduct,
    queryUn_Or_publishProduct,
    getSelectData,
    unGetSelectData,
    removeUndefindObject,
    updateNestedObject,
}