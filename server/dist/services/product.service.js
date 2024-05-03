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
const product_model_1 = require("../models/product.model");
const error_response_1 = require("../core/error.response");
class ProductFactory {
    /*
        * type :"clothing",
        * payload
    */
    createProduct(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case 'Electronics':
                    return new Electronics(payload);
                case 'Clothing':
                    return new Clothing(payload).createProduct();
                default:
                    throw new error_response_1.BadRequestError("Invalid type");
                    break;
            }
        });
    }
}
/*
    *define base prouct class
*/
class Product {
    constructor({ product_name, product_thump, product_description, product_Price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name;
        this.product_thump = product_thump;
        this.product_description = product_description;
        this.product_Price = product_Price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    createProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.ProductModels.create(this);
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
            const newClothing = yield product_model_1.clothesModels.create(this.product_attributes);
            if (!newClothing)
                throw new error_response_1.BadRequestError("create new Clothing error");
            const newProduct = yield _super.createProduct.call(this);
            if (!newProduct)
                throw new error_response_1.BadRequestError("create new Product error");
            return newProduct;
        });
    }
}
class Electronics extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield product_model_1.electronicModels.create(this.product_attributes);
            if (!newElectronic)
                throw new error_response_1.BadRequestError("create new Clothing error");
            const newProduct = yield _super.createProduct.call(this);
            if (!newProduct)
                throw new error_response_1.BadRequestError("create new Product error");
            return newProduct;
        });
    }
}
exports.default = new ProductFactory();
//# sourceMappingURL=product.service.js.map