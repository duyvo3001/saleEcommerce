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
const success_response_1 = require("../core/success.response");
// import productService from "../services/product.service";
const product_service_1 = require("../services/product.service");
const mongoose_1 = require("mongoose");
class ProductController {
    constructor() {
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: "Product created",
                // metadata: await productService.createProduct(req.body.product_type, {
                //     ...req.body,
                //     product_shop: req.headers['x-client-id']
                // })
                metadata: yield product_service_1.ProductFactory.createProduct(req.body.product_type, Object.assign(Object.assign({}, req.body), { product_shop: req.headers['x-client-id'] }))
            }).send(res);
        });
        /*
            * Query
        */
        /**
         * @desc Get all Drafts for shop
         * @param {Number} limit
         * @param {Number} Skip
         * @return {Json}
         */
        this.getAllDraftsForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const limit = 50, skip = 0;
            new success_response_1.SuccessResponse({
                message: "Product created",
                metadata: yield product_service_1.ProductFactory.findAllDraftsForShop({
                    product_shop: new mongoose_1.Types.ObjectId((_a = req.headers['x-client-id']) === null || _a === void 0 ? void 0 : _a.toString()),
                    limit,
                    skip
                })
            }).send(res);
        });
        /*
            * End Query
        */
    }
}
exports.default = new ProductController();
//# sourceMappingURL=product.controller.js.map