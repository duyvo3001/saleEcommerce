/*
    ?Discount Service
    ?_ 1 _ Generator Discount Code [shop | admin]
    ?_ 2 _ Get discount amount [User]
    ?_ 3 - Get all discount codes [User | Shop]
    ?_ 4 _ Verift discount code [User]
    ?_ 5 _ delete discount code [Admin | Shop]
    ?_ 6 _ Cancel discount code [User]
*/

import { Types } from "mongoose"
import { BadRequestError, NotFoundError } from "../core/error.response"
import { discountModels } from "../models/discount.model"
import { convertToObjectMongoDB } from "../utils/index.Utils"
import { findAllProductRepo } from "../models/repositories/product.repo"
import { checkDiscountExists, findAllDiscountCodesUnSelect } from "../models/repositories/discount.repo"

type DiscountCode = {
    code: string,
    start_date: Date,
    end_date: Date,
    is_active: boolean,
    shopId: Types.ObjectId,
    min_order_value: Number,
    product_ids: [],
    applies_to: string,
    name: string,
    description: string,
    type: string,
    value: number,
    max_value: number,
    max_uses: number,
    uses_count: number,
    max_uses_per_user: number,
    userId: Types.ObjectId,
    users_used: Types.ObjectId,
}
interface getAllDiscountCode {
    codeId: string,
    products: string[],
    limit: number,
    page: number,
}
interface IGetAllDiscountCode extends Pick<DiscountCode, 'code' | 'userId' | 'shopId'> {
    limit: number;
    page: number;
}
// interface IGetAllDiscountCodeWithShop extends DiscountCode, getAllDiscountCode {
//     shopId: string,
// }
// interface IGetAllDiscountAmount extends DiscountCode, getAllDiscountCode {
//     shopId: string,
//     userId :Types.ObjectId
// }

export class DiscountService {
    /*
        ?create discount code
     */
    static async createDiscountCode(payload: DiscountCode) {
        const {
            code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to,
            name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used, userId
        } = payload

        const checkDate = new Date() < new Date(start_date) || new Date() > new Date(end_date) // check code expried
        console.log(new Date() < new Date(start_date));

        if (checkDate === true) {
            throw new BadRequestError('Discount code has expried 2')
        }

        const check_start_end_Date = new Date(start_date) >= new Date(end_date)  // check date
        if (check_start_end_Date === true) {
            throw new BadRequestError('Start_date must be for end_date')
        }

        /*
            * create index for discount code
        */
        const foundDiscount = await discountModels.findOne({
            disscount_code: code,
            disscount_shopId: shopId,
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Disscount exists');
        }

        const newDiscount = await discountModels.create({
            discount_name: name,
            discount_description: description, discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        return newDiscount
    }

    static async updateDiscountCode() { }

    /*
        * get all discount codes avaliable with product 
    */


    static async getAllDiscountCodeWithProduct(payload: IGetAllDiscountCode) {
        const {
            code, shopId, userId, limit, page
        } = payload
        //create index for discount code 
        const foundDiscount = await discountModels.findOne({
            disscount_code: code,
            disscount_shopId: shopId,
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await findAllProductRepo({
                filter: {
                    product_shop: shopId,
                    isPublish: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProductRepo({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublish: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    /*
        * get all discount code for shop
    */

    static async getAllDiscountCodesByShop({ limit, page, shopId }: IGetAllDiscountCode) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            Select_unSelect: ['__v', 'discount_shopId'],
            model: discountModels
        })
        return discounts
    }

    // static async getDiscountAmount({ codeId, userId, shopId, products }: IGetAllDiscountCode) {
    //     const foundDiscount = await checkDiscountExists(discountModels, shopId)

    //     if (!foundDiscount) throw new NotFoundError(`discount doesn't exitst`)

    //     const {
    //         discount_is_active,
    //         discount_max_uses,
    //         discount_start_date,
    //         discount_end_date,
    //         discount_min_order_value,
    //         discount_max_uses_per_user,
    //         discount_users_used,
    //         discount_value,
    //         dicount_type
    //     } = foundDiscount

    //     if (!discount_is_active) throw new NotFoundError(`discount expried`);
    //     if (!discount_max_uses) throw new NotFoundError(`discount expried`);

    //     if (new Date() < new Date(discount_start_date || new Date() > new Date(discount_end_date))) {
    //         throw new NotFoundError(`discount code has expried 1`)
    //     }

    //     let totalOrder = 0

    //     if (discount_min_order_value > 0) {
    //         totalOrder = products?.reduce((acc: any, product: any) => {
    //             return acc + (product.quantity * product.price)
    //         }, 0)

    //         if (totalOrder < discount_min_order_value)
    //             throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}`)
    //     }

    //     if (discount_max_uses_per_user > 0) {
    //         const userDiscount = discount_users_used.find((user: any) => user.userId === userId)
    //         if (userDiscount) {

    //         }
    //     }

    //     const amount = dicount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    //     return {
    //         totalOrder,
    //         discount: amount,
    //         totalPrice: totalOrder - amount
    //     }
    // }
}