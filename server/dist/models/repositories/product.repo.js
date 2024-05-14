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
exports.updateProductById = exports.findProductRepo = exports.findAllProductRepo = exports.searchProductByUserRepo = exports.UnPublishProductByShopRepo = exports.publishProductByShopRepo = exports.findAllPublishForShopRepo = exports.findAllDraftsForShopRepo = void 0;
const productRepo_utils_1 = require("../../utils/productUtils/productRepo.utils");
const product_model_1 = require("../product.model");
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
const searchProductByUserRepo = (KeySearch) => __awaiter(void 0, void 0, void 0, function* () {
    const regexSearch = new RegExp(KeySearch);
    const results = product_model_1.ProductModels.findOne({
        $text: { $search: regexSearch.source }
    }, {
        score: { $meta: 'textScore' }
    })
        .sort({ score: { $meta: 'textScore' } }).lean()
        .lean();
    return results;
});
exports.searchProductByUserRepo = searchProductByUserRepo;
const findAllProductRepo = (_e) => __awaiter(void 0, [_e], void 0, function* ({ limit, sort, page, filter, select }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = yield product_model_1.ProductModels.findOne(filter, null, sortBy)
        // .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, productRepo_utils_1.getSelectData)(select))
        .lean();
    return products;
});
exports.findAllProductRepo = findAllProductRepo;
const findProductRepo = (_f) => __awaiter(void 0, [_f], void 0, function* ({ product_id, unSelect }) {
    return product_model_1.ProductModels.findById(product_id).select((0, productRepo_utils_1.unGetSelectData)(unSelect));
});
exports.findProductRepo = findProductRepo;
const updateProductById = (_g) => __awaiter(void 0, [_g], void 0, function* ({ product_id, bodyUpdate, model, isNew = true }) {
    return yield model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew });
});
exports.updateProductById = updateProductById;
//# sourceMappingURL=product.repo.js.map