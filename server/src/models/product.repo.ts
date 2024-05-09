import { Types } from "mongoose";
import { queryProduct, queryUn_Or_publishProduct, InterfaceFindProduct } from "../utils/productUtils/productRepo.utils";
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

export const searchProductByUserRepo = async ({KeySearch} : {KeySearch : string})=>{
    const regexSearch = new RegExp(KeySearch)
    const results = ProductModels.findOne({
        $text : {$search : regexSearch.toString()}
    },{
        scorce : {$meta : 'textScorce'}
    })
    .sort({scorce : {$meta : 'textScorce'}}).lean()
    .lean()
    return results
}

