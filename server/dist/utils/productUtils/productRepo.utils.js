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
exports.queryUn_Or_publishProduct = exports.queryProduct = void 0;
const product_model_1 = require("../../models/product.model");
const queryProduct = (_a) => __awaiter(void 0, [_a], void 0, function* ({ query, limit, skip }) {
    return yield product_model_1.ProductModels.find(query)
        .populate('product_shop', 'name email - id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
});
exports.queryProduct = queryProduct;
const queryUn_Or_publishProduct = (_b) => __awaiter(void 0, [_b], void 0, function* ({ product_shop, product_id, isDraft, isPublish }) {
    const foundShop = yield product_model_1.ProductModels.findOne({
        product_shop,
        _id: product_id,
    });
    if (!foundShop)
        return null;
    foundShop.isDraft = isDraft;
    foundShop.isPublish = isPublish;
    const { modifiedCount } = yield foundShop.updateOne(foundShop);
    return modifiedCount;
});
exports.queryUn_Or_publishProduct = queryUn_Or_publishProduct;
//# sourceMappingURL=productRepo.utils.js.map