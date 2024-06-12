import { Types } from "mongoose";
import { findCartById } from "../models/repositories/cart.repo";
import { BadRequestError } from "../core/error.response";
import { checkProductServer } from "../models/repositories/product.repo";
import { DiscountService } from "./discount.services";


interface IcheckoutReview {
    cartId: Types.ObjectId,
    userId: string,
    shop_order_ids: Array<Ishop_order_ids_news>
}
interface IOrder extends Pick<IcheckoutReview, 'cartId' | 'userId'> {
    shop_order_ids: Array<Ishop_order_ids_news>,
    user_address: string,
    user_payment: string
}
interface Ishop_order_ids_news {
    shopId: Types.ObjectId,
    shop_discount: Array<Ishop_discount>,
    item_products: Array<Iitem_products>,
}
interface Ishop_discount {
    shopId: Types.ObjectId,
    discountId: Types.ObjectId,
    codeId: string
}
interface Iitem_products {
    productId: Types.ObjectId
    quantity: number,
    price: number,
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

        let shop_array = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount, item_products } = shop_order_ids[i]

            const _CheckProductServer: Array<Iitem_products> = await checkProductServer(item_products)

            if (!_CheckProductServer[0]) throw new BadRequestError('order wrong')

            const checkoutPrice = await _CheckProductServer.reduce((acc: any, product: any) => {
                return acc + (product.quantity * product.price)
            }, 0)

            //total price before handling
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts: shop_discount,
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
                    products: [{
                        productId: _CheckProductServer[0].productId,
                        quantity: _CheckProductServer[0].quantity,
                        price: _CheckProductServer[0].price
                    }]
                })

                checkout_order.totalDiscount += +discount

                // total discount 
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
            shop_order_ids_news: shop_array,
            checkout_order
        }
    }

    static async orderByUser({ cartId, userId, shop_order_ids, user_address, user_payment }: IOrder) {

        const { shop_order_ids_news, checkout_order } = await checkOutService.checkoutReview({
            cartId, userId, shop_order_ids: shop_order_ids
        })

        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError(`Cart doesn't exist`)

        /*
            TODO check lai 1 lan nua co vuot ton kho 
        */

        const products = shop_order_ids.flatMap(order => order.item_products)

        console.log(products);
        for (let i = 0; i < products.length; i++) {
            const {productId , quantity} = products[i]
            
        }


    }

}