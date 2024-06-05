"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerDiscount = void 0;
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const dicount_Controller_1 = require("../../controllers/dicount.Controller");
exports.routerDiscount = express_1.default.Router();
exports.routerDiscount.post('/amount', (0, asyncHandler_1.asyncHandler)(dicount_Controller_1.DiscountController.getDiscountAmount));
exports.routerDiscount.use(authUtils_1.authentication);
exports.routerDiscount.post('/discountCode', (0, asyncHandler_1.asyncHandler)(dicount_Controller_1.DiscountController.createDiscountCode));
exports.routerDiscount.get('/all-list-discount-product', (0, asyncHandler_1.asyncHandler)(dicount_Controller_1.DiscountController.getAllDiscountCodesWithProduct));
exports.routerDiscount.get('/all-list-discount-shop', (0, asyncHandler_1.asyncHandler)(dicount_Controller_1.DiscountController.getAllDiscountCodesWithShop));
exports.routerDiscount.delete('', (0, asyncHandler_1.asyncHandler)(dicount_Controller_1.DiscountController.DeleteDiscount));
exports.routerDiscount.post('/cancel', (0, asyncHandler_1.asyncHandler)(dicount_Controller_1.DiscountController.CancelDiscount));
// routerDiscount.post('/amount',asyncHandler(DiscountController.getDiscountAmount))
//# sourceMappingURL=index.js.map