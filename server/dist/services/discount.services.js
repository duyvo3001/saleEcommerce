"use strict";
/*
    ?Discount Service
    ?_ 1 _ Generator Discount Code [shop | admin]
    ?_ 2 _ Get discount amount [User]
    ?_ 3 - Get all discount codes [User | Shop]
    ?_ 4 _ Verift discount code [User]
    ?_ 5 _ delete discount code [Admin | Shop]
    ?_ 6 _ Cancel discount code [User]
*/
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
exports.DiscountService = void 0;
const error_response_1 = require("../core/error.response");
const discount_model_1 = require("../models/discount.model");
const product_repo_1 = require("../models/repositories/product.repo");
const discount_repo_1 = require("../models/repositories/discount.repo");
class DiscountService {
    /*
        ?create discount code
     */
    static createDiscountCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used, userId } = payload;
            const checkDate = new Date() < new Date(start_date) || new Date() > new Date(end_date); // check code expried
            console.log(new Date() < new Date(start_date));
            if (checkDate === true) {
                throw new error_response_1.BadRequestError('Discount code has expried 2');
            }
            const check_start_end_Date = new Date(start_date) >= new Date(end_date); // check date
            if (check_start_end_Date === true) {
                throw new error_response_1.BadRequestError('Start_date must be for end_date');
            }
            /*
                * create index for discount code
            */
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExists)(discount_model_1.discountModels, {
                discount_code: code,
                discount_shopId: shopId,
            });
            if (foundDiscount && (foundDiscount === null || foundDiscount === void 0 ? void 0 : foundDiscount.discount_is_active)) {
                throw new error_response_1.BadRequestError('discount exists');
            }
            const newDiscount = yield discount_model_1.discountModels.create({
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
            });
            return newDiscount;
        });
    }
    static updateDiscountCode() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /*
        * get all discount codes avaliable with product
    */
    static getAllDiscountCodeWithProduct(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, shopId, userId, limit, page } = payload;
            //create index for discount code 
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExists)(discount_model_1.discountModels, {
                discount_code: code,
                discount_shopId: shopId,
            });
            if (!foundDiscount || !foundDiscount.discount_is_active) {
                throw new error_response_1.NotFoundError('Discount not exists');
            }
            const { discount_applies_to, discount_product_ids } = foundDiscount;
            let products;
            if (discount_applies_to === 'all') {
                products = yield (0, product_repo_1.findAllProductRepo)({
                    filter: {
                        product_shop: shopId,
                        isPublish: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name']
                });
            }
            if (discount_applies_to === 'specific') {
                products = yield (0, product_repo_1.findAllProductRepo)({
                    filter: {
                        _id: { $in: discount_product_ids },
                        isPublish: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name']
                });
            }
            return products;
        });
    }
    /*
        * get all discount code for shop
    */
    static getAllDiscountCodesByShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit, page, shopId }) {
            const discounts = yield (0, discount_repo_1.findAllDiscountCodesUnSelect)({
                limit: +limit,
                page: +page,
                sort: 'ctime',
                filter: {
                    discount_shopId: shopId,
                    discount_is_active: true
                },
                Select_unSelect: ['__v', 'discount_shopId'],
                model: discount_model_1.discountModels
            });
            return discounts;
        });
    }
    static getDiscountAmount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ codeId, userId, shopId, products }) {
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExists)(discount_model_1.discountModels, { discount_shopId: shopId });
            if (!foundDiscount)
                throw new error_response_1.NotFoundError(`discount doesn't exitst`);
            const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_min_order_value, discount_max_uses_per_user, discount_users_used, discount_value, dicount_type } = foundDiscount;
            if (!discount_is_active)
                throw new error_response_1.NotFoundError(`discount expried`);
            if (!discount_max_uses)
                throw new error_response_1.NotFoundError(`discount expried`);
            if (new Date() < new Date(discount_start_date || new Date() > new Date(discount_end_date))) {
                throw new error_response_1.NotFoundError(`discount code has expried 1`);
            }
            let totalOrder = 0;
            if (discount_min_order_value > 0) {
                totalOrder = products.reduce((acc, product) => {
                    return acc + (product.quantity * product.price);
                }, 0);
                if (totalOrder < discount_min_order_value)
                    throw new error_response_1.NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}`);
            }
            if (discount_max_uses_per_user > 0) {
                const userDiscount = discount_users_used.find((user) => user.userId === userId);
                if (userDiscount) {
                }
            }
            const amount = dicount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            };
        });
    }
}
exports.DiscountService = DiscountService;
//# sourceMappingURL=discount.services.js.map