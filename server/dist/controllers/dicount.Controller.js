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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountController = void 0;
const mongoose_1 = require("mongoose");
const success_response_1 = require("../core/success.response");
const discount_services_1 = require("../services/discount.services");
class DiscountController {
}
exports.DiscountController = DiscountController;
_a = DiscountController;
DiscountController.createDiscountCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { code, is_active, product_ids, applies_to, name, description, min_order_value, type, value, max_value, max_uses, uses_count, max_uses_per_user, userId, users_used, limit, page, start_date, end_date } = req.body;
    const payload = {
        code,
        start_date,
        end_date,
        is_active,
        shopId: new mongoose_1.Types.ObjectId((_b = req.headers['x-client-id']) === null || _b === void 0 ? void 0 : _b.toString()),
        min_order_value,
        product_ids,
        applies_to,
        name,
        description,
        type,
        value,
        max_value,
        max_uses,
        uses_count,
        max_uses_per_user,
        userId,
        users_used,
    };
    new success_response_1.CREATED({
        message: "Created discount success",
        metadata: yield discount_services_1.DiscountService.createDiscountCode(payload)
    }).send(res);
});
DiscountController.getAllDiscountCodesWithProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, shopId, userId, limit, page } = req.query;
    const payload = {
        code: code,
        shopId: new mongoose_1.Types.ObjectId(shopId),
        userId: userId,
        limit: Number(limit),
        page: Number(page)
    };
    new success_response_1.SuccessResponse({
        message: "Get token success",
        metadata: yield discount_services_1.DiscountService.getAllDiscountCodeWithProduct(payload)
    }).send(res);
});
DiscountController.getAllDiscountCodesWithShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId, limit, page } = req.query;
    const payload = {
        shopId: new mongoose_1.Types.ObjectId(shopId),
        limit: Number(limit),
        page: Number(page)
    };
    new success_response_1.SuccessResponse({
        message: "Get token success",
        metadata: yield discount_services_1.DiscountService.getAllDiscountCodesByShop(payload)
    }).send(res);
});
DiscountController.getDiscountAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { codeId, shopId, userId, products } = req.body;
    const payload = {
        codeId: codeId,
        shopId: new mongoose_1.Types.ObjectId(shopId),
        userId: userId,
        products: products
    };
    new success_response_1.SuccessResponse({
        message: "Get token success",
        metadata: yield discount_services_1.DiscountService.getDiscountAmount(payload)
    }).send(res);
});
DiscountController.DeleteDiscount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { codeId, shopId, userId, products } = req.body;
    const payload = {
        codeId: codeId,
        shopId: new mongoose_1.Types.ObjectId(shopId),
    };
    new success_response_1.SuccessResponse({
        message: "Get token success",
        metadata: yield discount_services_1.DiscountService.deleteDiscountCode(payload)
    }).send(res);
});
DiscountController.CancelDiscount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { codeId, shopId, userId } = req.body;
    const payload = {
        codeId: codeId,
        shopId: new mongoose_1.Types.ObjectId(shopId),
        userId: userId,
    };
    new success_response_1.SuccessResponse({
        message: "Get token success",
        metadata: yield discount_services_1.DiscountService.cancelDiscountCode(payload)
    }).send(res);
});
//# sourceMappingURL=dicount.Controller.js.map