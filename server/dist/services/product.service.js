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
exports.ProductFactory = void 0;
const productRepo_utils_1 = require("./../utils/productUtils/productRepo.utils");
const mongoose_1 = require("mongoose");
const product_model_1 = require("../models/product.model");
const error_response_1 = require("../core/error.response");
const product_repo_1 = require("../models/repositories/product.repo");
const inventory_repo_1 = require("../models/repositories/inventory.repo");
class ProductFactory {
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static createProduct(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass)
                throw new error_response_1.BadRequestError("Invalid type");
            return new productClass(payload).createProduct();
        });
    }
    static updateProduct(type, product_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass)
                throw new error_response_1.BadRequestError("Invalid type");
            return new productClass(payload).updateProduct(product_id);
        });
    }
    /*
        * find draft product for shop
    */
    static findAllDraftsForShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, limit, skip }) {
            const query = { product_shop, isDraft: true };
            return yield (0, product_repo_1.findAllDraftsForShopRepo)({ query, limit, skip });
        });
    }
    static findAllPublishForShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, limit, skip }) {
            const query = { product_shop, isPublish: true };
            return yield (0, product_repo_1.findAllPublishForShopRepo)({ query, limit, skip });
        });
    }
    /*
        *  PUT publish Product
    */
    static publishProductByShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, product_id }) {
            return yield (0, product_repo_1.publishProductByShopRepo)({ product_shop, product_id });
        });
    }
    /*
       *  PUT UnPublish Product
   */
    static UnPublishProductByShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, product_id }) {
            return yield (0, product_repo_1.publishProductByShopRepo)({ product_shop, product_id });
        });
    }
    /*
        *  GET search Product
    */
    static searchProduct(KeySearch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.searchProductByUserRepo)(KeySearch);
        });
    }
    static findAllProducts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
            return yield (0, product_repo_1.findAllProductRepo)({
                limit, sort, filter, page,
                select: ['product_name', 'product_Price', 'product_thump']
            });
        });
    }
    static findProduct(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_id, unSelect }) {
            return yield (0, product_repo_1.findProductRepo)({ product_id, unSelect: unSelect });
        });
    }
}
exports.ProductFactory = ProductFactory;
/*
    * type :"clothing",
    * payload
*/
ProductFactory.productRegistry = {};
/*
    *define base prouct class
*/
class Product {
    constructor({ product_name, product_thump, product_description, product_Price, product_quantity, product_type, product_shop, product_attributes, }) {
        this.product_name = product_name;
        this.product_thump = product_thump;
        this.product_description = product_description;
        this.product_Price = product_Price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    /*
        * create product
    */
    createProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = yield product_model_1.ProductModels.create(Object.assign(Object.assign({}, this), { _id: product_id }));
            const productid = yield newProduct._id;
            if (newProduct) {
                yield (0, inventory_repo_1.insertInventory)({
                    product_id: productid,
                    shop_id: this.product_shop,
                    stock: this.product_quantity,
                    location: 'unKnown'
                });
            }
            return newProduct;
        });
    }
    /*
        * update product
    */
    updateProduct(product_id, bodyUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.updateProductById)({ product_id: product_id, bodyUpdate: bodyUpdate, model: product_model_1.ProductModels, isNew: true });
        });
    }
}
/*
    * define sub-class for different product types clothing
*/
class Clothing extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newClothing = yield product_model_1.clothesModels.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newClothing)
                throw new error_response_1.BadRequestError("create new Clothing error");
            const newProduct = yield _super.createProduct.call(this, newClothing._id);
            if (!newProduct)
                throw new error_response_1.BadRequestError("create new Product error");
            return newProduct;
        });
    }
    updateProduct(product_id) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = (0, productRepo_utils_1.removeUndefindObject)(this);
            /*
                * remove obj a{ a : 2 } but don't remove obj a{ b : 1} in obj  a{ a : 2 , b : 1 }
            */
            const updateNestedObj_attributes = (0, productRepo_utils_1.updateNestedObject)(objectParams.product_attributes);
            const updateNestedObj_params = (0, productRepo_utils_1.updateNestedObject)(objectParams);
            if (objectParams.product_attributes) {
                yield (0, product_repo_1.updateProductById)({
                    product_id: product_id,
                    bodyUpdate: updateNestedObj_attributes,
                    model: product_model_1.clothesModels,
                    isNew: true
                });
            }
            const updateProduct = yield _super.updateProduct.call(this, product_id, updateNestedObj_params);
            return updateProduct;
        });
    }
}
class Electronics extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield product_model_1.electronicModels.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: new mongoose_1.Types.ObjectId(this.product_shop) }));
            if (!newElectronic)
                throw new error_response_1.BadRequestError("create new Electronic error");
            const newProduct = yield _super.createProduct.call(this, newElectronic._id);
            if (!newProduct)
                throw new error_response_1.BadRequestError("create new Product error");
            return newProduct;
        });
    }
}
class Furniture extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newfurniture = yield product_model_1.furnitureModels.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: new mongoose_1.Types.ObjectId(this.product_shop) }));
            if (!newfurniture)
                throw new error_response_1.BadRequestError("create new furniture error");
            const newProduct = yield _super.createProduct.call(this, newfurniture._id);
            if (!newProduct)
                throw new error_response_1.BadRequestError("create new Product error");
            return newProduct;
        });
    }
}
//register product type 
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);
ProductFactory.registerProductType("Clothing", Clothing);
// export default new ProductFactory()
//# sourceMappingURL=product.service.js.map