import { Types } from "mongoose";
import { queryProduct, queryUn_Or_publishProduct, InterfaceFindProduct, unGetSelectData, getSelectData } from "../../utils/productUtils/productRepo.utils";
import { ProductModels } from "../product.model";
import { Un_Or_publishProductByShop, IfindAllProduct, IfindProductRepo, IupdateProductById } from "./interface/IProduct";

export const findAllDraftsForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => queryProduct({ query, limit, skip })

export const findAllPublishForShopRepo = async ({ query, limit, skip }: InterfaceFindProduct) => queryProduct({ query, limit, skip })

export const publishProductByShopRepo = async ({ product_shop, product_id }: Un_Or_publishProductByShop) => queryUn_Or_publishProduct({ product_shop, product_id, isDraft: false, isPublish: true })

export const UnPublishProductByShopRepo = async ({ product_shop, product_id }: Un_Or_publishProductByShop) => queryUn_Or_publishProduct({ product_shop, product_id, isDraft: true, isPublish: false })

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

/*
    * params : limit, sort, page, filter, select
*/
export const findAllProductRepo = async ({ limit, sort, page, filter, select }: IfindAllProduct) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await ProductModels.findOne(filter, null, sortBy)
        // .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

export const findProductRepo = async ({ product_id, unSelect }: IfindProductRepo) => ProductModels.findById(product_id).select(unGetSelectData(unSelect))

export const getProductById = async (product_id: Types.ObjectId) => await ProductModels.findOne({ _id: product_id })


export const updateProductById = async ({ product_id, bodyUpdate, model, isNew = true }: IupdateProductById) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew });
}

export const checkProductServer : any = async (products: any) => {

    return await Promise.all(products.map(async (product: any) => {

        const foundProduct = await getProductById(product.productId)
        console.log('product quantity found',product.quantity);
        
        if (foundProduct) {
            return {
                price: foundProduct.product_Price,
                quantity: product.quantity,
                productId: foundProduct._id
            }
        }

    }))

}