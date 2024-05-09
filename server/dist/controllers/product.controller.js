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
exports.ProductController = void 0;
const success_response_1 = require("../core/success.response");
const product_service_1 = require("../services/product.service");
const mongoose_1 = require("mongoose");
class ProductController {
}
exports.ProductController = ProductController;
_a = ProductController;
ProductController.createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.SuccessResponse({
        message: "Product created",
        metadata: yield product_service_1.ProductFactory.createProduct(req.body.product_type, Object.assign(Object.assign({}, req.body), { product_shop: req.headers['x-client-id'] }))
    }).send(res);
});
/*
    * Query Drafts
*/
/**
 * @desc Get all Drafts for shop
 * @param {Number} limit
 * @param {Number} Skip
 * @return {Json}
 */
ProductController.getAllDraftsForShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const limit = 50, skip = 0;
    new success_response_1.SuccessResponse({
        message: "Draft of shop",
        metadata: yield product_service_1.ProductFactory.findAllDraftsForShop({
            product_shop: new mongoose_1.Types.ObjectId((_b = req.headers['x-client-id']) === null || _b === void 0 ? void 0 : _b.toString()),
            limit,
            skip
        })
    }).send(res);
});
/*
    * End Query
*/
/*
    * Query Publish
*/
/**
 * @desc Get all Drafts for shop
 * @param {Number} limit
 * @param {Number} Skip
 * @return {Json}
 */
ProductController.getAllPublishForShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const limit = 50, skip = 0;
    new success_response_1.SuccessResponse({
        message: "get publish for shop",
        metadata: yield product_service_1.ProductFactory.findAllPublishForShop({
            product_shop: new mongoose_1.Types.ObjectId((_c = req.headers['x-client-id']) === null || _c === void 0 ? void 0 : _c.toString()),
            limit,
            skip
        })
    }).send(res);
});
/*
    * End Query
*/
ProductController.PublishProductByShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    new success_response_1.SuccessResponse({
        message: "publish for shop success",
        metadata: yield product_service_1.ProductFactory.publishProductByShop({
            product_id: new mongoose_1.Types.ObjectId(req.params.id),
            product_shop: new mongoose_1.Types.ObjectId((_d = req.headers['x-client-id']) === null || _d === void 0 ? void 0 : _d.toString())
        })
    }).send(res);
});
ProductController.UnPublishProductByShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    new success_response_1.SuccessResponse({
        message: "Un Publish for shop success",
        metadata: yield product_service_1.ProductFactory.UnPublishProductByShop({
            product_id: new mongoose_1.Types.ObjectId(req.params.id),
            product_shop: new mongoose_1.Types.ObjectId((_e = req.headers['x-client-id']) === null || _e === void 0 ? void 0 : _e.toString())
        })
    }).send(res);
});
ProductController.getListSearchProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    new success_response_1.SuccessResponse({
        message: "Get list search product success",
        metadata: yield product_service_1.ProductFactory.searchProduct({ KeySearch: req.params.toString() })
    }).send(res);
});
//# sourceMappingURL=product.controller.js.map