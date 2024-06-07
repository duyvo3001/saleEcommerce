import { Types } from "mongoose";
import { findCartById } from "../models/repositories/cart.repo";
import { BadRequestError } from "../core/error.response";
import { checkProductServer } from "../models/repositories/product.repo";
import { DiscountService } from "./discount.services";


interface IcheckoutReview {
    cartId: Types.ObjectId,
    userId: string,
    shop_order_ids: Types.ObjectId
}
interface Ishop_discount {
    shopId: Types.ObjectId,
    discountId: Types.ObjectId,
    codeId: string
}
interface Iitem_products {
    price: number,
    quantity: number,
    productId: Types.ObjectId
}
interface Ishop_order_ids_news {
    shopId: Types.ObjectId,
    shop_discount: Array<Ishop_discount>,
    item_products: Array<Iitem_products>,
}

export class checkOutService {

    /*
    {
        cartId,
        userId,
        shop_order_ids:
            {
            shopId,
            shop_discount: [],
            item_products: [
                {
                price,
                quantity,
                productId
                },
            ]
            },
            shopId,
            shop_discount: [
            {
                "shopId",
                "discountId",
                codeId:
            ],
            item_products: [
                {
                price, 
                quantity,
                productId
                }
            ]
    */
    static async checkoutReview({ cartId, userId, shop_order_ids }: IcheckoutReview) {

        const foundCart = await findCartById(cartId)

        if (!foundCart) throw new BadRequestError(`Cart doesn't exist`)
        let checkout_order = {
            totalPrice: 0, // total price
            feeShip: 0, // fee ship price,
            totalDiscount: 0, // total discount
            totalCheckout: 0, // total
        }

        const shop_order_ids_news: Array<Ishop_order_ids_news> = []

        let shop_array = []

        for (let i = 0; i < shop_order_ids_news.length; i++) {
            const { shopId, shop_discount, item_products } = shop_order_ids_news[i]

            const _CheckProductServer = await checkProductServer(item_products)

            if (!_CheckProductServer[0]) throw new BadRequestError('order wrong')

            const checkoutPrice = await checkProductServer.reduce((acc: any, product: any) => {
                return acc + (product.quantity * product.price)
            }, 0)

            //total price before handling
            checkout_order += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts: shop_discount ,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: _CheckProductServer
            }

            //if shop_discounts alivable > 0 , check valid or not
            if (shop_discount.length > 0) {
                const { totalOrder, discount, totalPrice } = await DiscountService.getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: _CheckProductServer
                })
                // total discount 
                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // total final
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_array.push(itemCheckout)

        }

        return {
            shop_order_ids,
            shop_order_ids_news : shop_array,
            checkout_order
        }
    }

}