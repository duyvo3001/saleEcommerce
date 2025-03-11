import { findCartById } from "../models/repositories/cart.repo";
import { BadRequestError } from "../core/error.response";
import { checkProductServer } from "../models/repositories/product.repo";
import { DiscountService } from "./discount.services";
import { acquireLock, releaseLock } from "./redis.services";
import { orderModel } from "../models/order.model";
import { IcheckoutReview, Iitem_products, IOrder } from "./interface/Icheckout";
import { CartService } from "./cart.service";
import { Types } from "mongoose";
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

  static async checkoutReview({
    cartId,
    userId,
    shop_order_ids,
  }: IcheckoutReview) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError(`Cart doesn't exist`);

    let checkout_order = {
      totalPrice: 0, // total price
      feeShip: 0, // fee ship price,
      totalDiscount: 0, // total discount
      totalCheckout: 0, // total
    };

    let shop_array = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discount, item_products } = shop_order_ids[i];

      const _CheckProductServer: Array<Iitem_products> =
        await checkProductServer(item_products);

      if (!_CheckProductServer[0]) throw new BadRequestError("order wrong");

      const checkoutPrice = await _CheckProductServer.reduce(
        (acc: any, product: any) => {
          return acc + product.quantity * product.price;
        },
        0
      );

      //total price before handling
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts: shop_discount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: _CheckProductServer,
      };

      //if shop_discounts alivable > 0 , check valid or not
      if (shop_discount.length > 0) {
        const { totalOrder, discount, totalPrice } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discount[0].codeId,
            userId,
            shopId,
            products: [
              {
                productId: _CheckProductServer[0].productId,
                quantity: _CheckProductServer[0].quantity,
                price: _CheckProductServer[0].price,
              },
            ],
          });

        checkout_order.totalDiscount += +discount;

        // total discount
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // total final
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_array.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_news: shop_array,
      checkout_order,
    };
  }

  static async orderByUser({
    cartId,
    userId,
    shop_order_ids,
    user_address,
    user_payment,
  }: IOrder) {
    const { shop_order_ids_news, checkout_order } =
      await checkOutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError(`Cart doesn't exist`);

    /*
            TODO check lai 1 lan nua co vuot ton kho 
        */

    //get new array of product
    const products = shop_order_ids.flatMap((order) => order.item_products);

    const acquireProducct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock({ productId, quantity, cartId });

      acquireProducct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    /*
     * check if out of stock in inventory
     */
    if (acquireProducct.includes(false)) {
      throw new BadRequestError(
        `1 so san pham da duoc cap nhat, vui long quay lai gio hang`
      );
    }

    /*
     * create a new order in ORDER
     */
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_product: shop_order_ids_news,
    });

    /*
     *if insert success then remove product in cart
     */
    if (newOrder != null) {
      for (let i = 0; i < products.length; i++) {
        await CartService.deleteUserCart({
          userId: +userId,
          productId: products[i].productId,
        });
      }
    }

    return { newOrder };
  }

  /*
        ? 1. Query Order [user]
    */
  static async getOrderbyUser(userId: string) {

    const order = await orderModel.findOne({ order_userId: userId });

    if (order == null) {
      throw new BadRequestError(`Order ${userId} not found`);
    }
    return { order };
  }

  /*
        ? 2. Query Order Using by ID [user]
    */
  static async getOneOrderbyUser({ userId, productId, }: { userId: string; productId: Types.ObjectId; }) {

    const query = {
      order_userId: userId,
      'order_product.item_products.productId': productId
    }
    const order = await orderModel.findOne(query);

    if (order == null) {
      throw new BadRequestError(`Order ${userId} not found`);
    }

    return { order };
  }

  /*
        ? 3. Query  Cancel Order [user]
    */
  static async cancelOrderbyUser({ userId, productId, }: { userId: string; productId: Types.ObjectId; }) {

  }

  /*
        ? 4. Query update Status [Shop/admin]
    */
  static async updateOrderStatusbyShop() { }
}
