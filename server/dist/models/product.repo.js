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
exports.searchProductByUserRepo = exports.UnPublishProductByShopRepo = exports.publishProductByShopRepo = exports.findAllPublishForShopRepo = exports.findAllDraftsForShopRepo = void 0;
const productRepo_utils_1 = require("../utils/productUtils/productRepo.utils");
const product_model_1 = require("./product.model");
const findAllDraftsForShopRepo = (_a) => __awaiter(void 0, [_a], void 0, function* ({ query, limit, skip }) {
    return (0, productRepo_utils_1.queryProduct)({ query, limit, skip });
});
exports.findAllDraftsForShopRepo = findAllDraftsForShopRepo;
const findAllPublishForShopRepo = (_b) => __awaiter(void 0, [_b], void 0, function* ({ query, limit, skip }) {
    return (0, productRepo_utils_1.queryProduct)({ query, limit, skip });
});
exports.findAllPublishForShopRepo = findAllPublishForShopRepo;
const publishProductByShopRepo = (_c) => __awaiter(void 0, [_c], void 0, function* ({ product_shop, product_id }) {
    return (0, productRepo_utils_1.queryUn_Or_publishProduct)({ product_shop, product_id, isDraft: false, isPublish: true });
});
exports.publishProductByShopRepo = publishProductByShopRepo;
const UnPublishProductByShopRepo = (_d) => __awaiter(void 0, [_d], void 0, function* ({ product_shop, product_id }) {
    return (0, productRepo_utils_1.queryUn_Or_publishProduct)({ product_shop, product_id, isDraft: true, isPublish: false });
});
exports.UnPublishProductByShopRepo = UnPublishProductByShopRepo;
const searchProductByUserRepo = (_e) => __awaiter(void 0, [_e], void 0, function* ({ KeySearch }) {
    const regexSearch = new RegExp(KeySearch);
    const results = product_model_1.ProductModels.findOne({
        $text: { $search: regexSearch.toString() }
    }, {
        scorce: { $meta: 'textScorce' }
    })
        .sort({ scorce: { $meta: 'textScorce' } }).lean()
        .lean();
    return results;
});
exports.searchProductByUserRepo = searchProductByUserRepo;
//# sourceMappingURL=product.repo.js.map