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
exports.publishProductByShopRepo = exports.findAllPublishForShopRepo = exports.findAllDraftsForShopRepo = void 0;
const product_model_1 = require("./product.model");
const findAllDraftsForShopRepo = (_a) => __awaiter(void 0, [_a], void 0, function* ({ query, limit, skip }) {
    return queryProduct({ query, limit, skip });
});
exports.findAllDraftsForShopRepo = findAllDraftsForShopRepo;
const findAllPublishForShopRepo = (_b) => __awaiter(void 0, [_b], void 0, function* ({ query, limit, skip }) {
    return queryProduct({ query, limit, skip });
});
exports.findAllPublishForShopRepo = findAllPublishForShopRepo;
const queryProduct = (_c) => __awaiter(void 0, [_c], void 0, function* ({ query, limit, skip }) {
    return yield product_model_1.ProductModels.find(query)
        .populate('product_shop', 'name email - id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
});
const publishProductByShopRepo = (_d) => __awaiter(void 0, [_d], void 0, function* ({ product_shop, product_id }) {
    const foundShop = yield product_model_1.ProductModels.findOne({
        product_shop,
        _id: product_id
    });
    if (!foundShop)
        return null;
    foundShop.isDraft = false;
    foundShop.isPublish = true;
    const { modifiedCount } = yield foundShop.updateOne(foundShop);
    return modifiedCount;
});
exports.publishProductByShopRepo = publishProductByShopRepo;
//# sourceMappingURL=product.repo.js.map