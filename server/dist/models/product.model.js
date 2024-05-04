"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.furnitureModels = exports.clothesModels = exports.electronicModels = exports.ProductModels = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
// Declare the Schema of the Mongo model
const productSchema = new mongoose_1.Schema({
    product_name: { type: String, required: true, },
    product_thump: { type: String, required: true, },
    product_description: String,
    product_Price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: [String], required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: mongoose_1.Types.ObjectId,
    product_attributes: { type: mongoose_1.Schema.Types.Mixed, required: true, },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
//Export the model
const clothingSchema = new mongoose_1.Schema({
    brand: { type: String, required: true },
    product_shop: mongoose_1.Types.ObjectId,
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true,
});
const electronicSchecma = new mongoose_1.Schema({
    brand: { type: String, required: true },
    product_shop: mongoose_1.Types.ObjectId,
    size: String,
    material: String
}, {
    collection: 'electronics',
    timestamps: true,
});
const furnitureSchecma = new mongoose_1.Schema({
    brand: { type: String, required: true },
    product_shop: mongoose_1.Types.ObjectId,
    size: String,
    material: String
}, {
    collection: 'furniture',
    timestamps: true,
});
exports.ProductModels = (0, mongoose_1.model)(DOCUMENT_NAME, productSchema);
exports.electronicModels = (0, mongoose_1.model)('electronics', electronicSchecma);
exports.clothesModels = (0, mongoose_1.model)('clothes', clothingSchema);
exports.furnitureModels = (0, mongoose_1.model)('furniture', furnitureSchecma);
//# sourceMappingURL=product.model.js.map