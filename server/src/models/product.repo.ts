import { Types } from "mongoose";
import { queryProduct, queryUn_Or_publishProduct, InterfaceFindProduct, unGetSelectData, getSelectData } from "../utils/productUtils/productRepo.utils";
import { ProductModels } from "./product.model";
export const findAllDraftsForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return queryProduct({ query, limit, skip })
}

export const findAllPublishForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => {
    return queryProduct({ query, limit, skip })
}

export const publishProductByShopRepo = async ({ product_shop, product_id }:
    { product_shop: Types.ObjectId, product_id: Types.ObjectId }) => {
    return queryUn_Or_publishProduct({ product_shop, product_id, isDraft: false, isPublish: true })
}

export const UnPublishProductByShopRepo = async ({ product_shop, product_id }:
    { product_shop: Types.ObjectId, product_id: Types.ObjectId }) => {
    return queryUn_Or_publishProduct({ product_shop, product_id, isDraft: true, isPublish: false })
}

export const searchProductByUserRepo = async (KeySearch: string) => {
    const regexSearch = new RegExp(KeySearch)

    const results = ProductModels.findOne({
        $text: { $search: regexSearch.source }
    }, {
        score: { $meta: 'textScore' }
    })
        .sort({ score: { $meta: 'textScore' } }).lean()
        .lean()
    return results
}

export const findAllProductRepo = async ({ limit, sort, page, filter, select }: {
    limit: number, sort: string, page: number, filter: { isPublish: boolean }, select: string[]
}) => {
    const skip = (page - 1) * limit
    const sortBy =  sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await ProductModels.findOne(filter,null,sortBy)
        // .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

export const findProductRepo = async({product_id,unSelect}:{product_id:string,unSelect : string[]})=>{
    return ProductModels.findById(product_id).select(unGetSelectData(unSelect))
}

