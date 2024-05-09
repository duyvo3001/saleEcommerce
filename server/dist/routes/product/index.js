"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const product_controller_1 = require("../../controllers/product.controller");
const routerProduct = express_1.default.Router();
// authentication //
routerProduct
    .get('/search/all/:KeySearch', product_controller_1.ProductController.getListSearchProduct);
routerProduct.use(authUtils_1.authentication)
    .post('', (0, asyncHandler_1.asyncHandler)(product_controller_1.ProductController.createProduct))
    .put('/Publish/:id', (0, asyncHandler_1.asyncHandler)(product_controller_1.ProductController.PublishProductByShop))
    .put('/UnPublish/:id', (0, asyncHandler_1.asyncHandler)(product_controller_1.ProductController.UnPublishProductByShop))
    //QUERY 
    .get('/drafts/all', (0, asyncHandler_1.asyncHandler)(product_controller_1.ProductController.getAllDraftsForShop))
    .get('/publish/all', (0, asyncHandler_1.asyncHandler)(product_controller_1.ProductController.getAllPublishForShop));
exports.default = routerProduct;
//# sourceMappingURL=index.js.map