"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const cart_model_1 = require("../models/cart.model");
const error_response_1 = require("../core/error.response");
const product_repo_1 = require("../models/repositories/product.repo");
class CartService {
    /*
        * start repo cart
    */
    static createUserCart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, product }) {
            const query = { cart_userId: userId, cart_state: 'active' };
            const updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            };
            const options = { upsert: true, new: true };
            const test = yield cart_model_1.cartModel.findOneAndUpdate(query, updateOrInsert, options);
            console.log("test1", test);
            return test;
        });
    }
    static updateUserCartQuantity(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, product }) {
            const { productId, quantity } = product;
            const query = {
                cart_userId: userId,
                'cart_products.productId': productId,
                cart_state: 'active'
            };
            const udateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity
                }
            };
            const options = { upsert: true, new: true };
            const test = yield cart_model_1.cartModel.findOneAndUpdate(query, udateSet, options);
            console.log("test1", test);
            return test;
        });
    }
    /*
        * end repo cart
    */
    static addTocart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, product }) {
            //check cart is aviable 
            const userCart = yield cart_model_1.cartModel.findOne({ cart_userId: userId });
            if (userCart == null || !userCart) {
                return yield CartService.createUserCart({ userId, product });
            }
            /*
                ? if had cart but no product
            */
            if (!userCart.cart_products.length) {
                userCart.cart_products = [product];
                return yield userCart.save();
            }
            /*
                ? add different product
            */
            let checkProducts = false;
            for (let index = 0; index < userCart.cart_products.length; index++) {
                if (product.productId === userCart.cart_products[index].productId) {
                    checkProducts = true;
                }
            }
            if (checkProducts !== true) {
                userCart.cart_products.push(product);
                return yield userCart.save();
            }
            return yield CartService.updateUserCartQuantity({ userId, product });
        });
    }
    static addTocartV2(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, shop_order_ids }) {
            const test = shop_order_ids[0].item_products;
            const { productId, quantity, old_quantity } = test[0];
            //check foundProduct
            const foundProduct = yield (0, product_repo_1.getProductById)(productId);
            if (!foundProduct)
                throw new error_response_1.NotFoundError('Product not found');
            // compare
            if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId.toString())
                throw new error_response_1.NotFoundError('Product not belong to the shop');
            //if quantity == 0 delete from cart
            if (quantity === 0) {
                //deleted
            }
            return yield CartService.updateUserCartQuantity({
                userId, product: {
                    productId, quantity: quantity - old_quantity
                }
            });
        });
    }
    static deleteUserCart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, productId }) {
            const query = { cart_userId: userId, cart_state: 'active' };
            const updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            };
            const deleteCart = yield cart_model_1.cartModel.updateOne(query, updateSet);
            return deleteCart;
        });
    }
    static getListUsersCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_model_1.cartModel.findOne({ cart_userId: userId });
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map