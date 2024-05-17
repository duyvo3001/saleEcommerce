import { checkOverload } from './../../helpers/check.connect';
import { Types } from "mongoose"
import { unGetSelectData } from "../../utils/productUtils/productRepo.utils"
import { discountModels } from '../discount.model';


type filterFindAllProdut = { discount_is_active: boolean } | { discount_is_active: boolean, discount_shopId: Types.ObjectId } | { discount_is_active: boolean, discount_shopId: any }
type findAlldiscountCode = { limit: number, page: number, sort: string, filter: filterFindAllProdut, Select_unSelect: string[], model: any }

export const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, Select_unSelect, model
}: findAlldiscountCode) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documnets = await model.findOne(filter, null, sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(Select_unSelect))
        .lean()
    return documnets
}

export const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, Select_unSelect, model
}: findAlldiscountCode) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documnets = await model.findOne(filter, null, sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(Select_unSelect))
        .lean()
    return documnets
}

export const checkDiscountExists = async (model: any, filter: any) => await model.findOne(filter).lean()
