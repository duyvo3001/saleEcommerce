import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { BadRequestError, NotFoundError } from "../core/error.response";
import { getProductById } from "../models/repositories/product.repo";
import { query } from "express";
import { addtocart, product, IaddTocart, IUpdateCart, IdeleteCart } from "./interface/Icart";

export class CartService {
    /*
        key :
        * add product
        * reduce product quantity by one user
        * inrease product quantity by one user
        * get cart
        * delete cart user
        * delete cart item user
    */
    /*
        * start repo cart
    */
    static async createUserCart({ userId, product }: addtocart) {

        const query = { cart_userId: userId, cart_state: 'active' }
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }
        const options = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }
    static async updateUserCartQuantity({ userId, product }: { userId: Types.ObjectId, product: product }) {
        const { productId, quantity } = product

        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }
        const udateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }
        const options = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, udateSet, options);
    }

    /*
        * end repo cart
    */

    static async addTocart({ userId, product }: IaddTocart) {

        //check cart is aviable 
        const userCart = await cartModel.findOne({ cart_userId: userId })

        if (userCart == null || !userCart) {
            return await CartService.createUserCart({ userId, product })
        }

        /*
            ? if had cart but no product 
        */
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        /*
            ? add different product
        */
        let checkProducts = false
        for (let index = 0; index < userCart.cart_products.length; index++) {
            if (product.productId === userCart.cart_products[index].productId) {
                checkProducts = true
            }
        }

        if (checkProducts !== true) {
            userCart.cart_products.push(product)
            return await userCart.save()
        }

        return await CartService.updateUserCartQuantity({ userId, product })
    }

    static async addTocartV2({ userId, shop_order_ids }: IUpdateCart) {
        const test: any = shop_order_ids[0].item_products
        const { productId, quantity, old_quantity } = test[0]

        //check foundProduct
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not found')
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId.toString())
            throw new NotFoundError('Product not belong to the shop')

        //if quantity == 0 delete from cart
        if (quantity === 0) {
            //deleted
        }

        return await CartService.updateUserCartQuantity({
            userId, product: {
                productId, quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }: IdeleteCart) {
        const query = { cart_userId: userId, cart_state: 'active' }
        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart
    }
        static async getListUsersCart(userId: string) {
        return await cartModel.findOne({ cart_userId: userId })
    }
}