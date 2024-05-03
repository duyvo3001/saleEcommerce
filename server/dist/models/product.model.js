"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clothesModels = exports.electronicModels = exports.ProductModels = void 0;
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
    product_type: { type: [String], required: true, enum: ['Electionics', 'Clothing', 'furniture'] },
    product_shop: String,
    product_attributes: { type: mongoose_1.Schema.Types.Mixed, required: true, },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
//Export the model
const clothingShecma = new mongoose_1.Schema({
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true,
});
const electronicShecma = new mongoose_1.Schema({
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    collection: 'electronics',
    timestamps: true,
});
exports.ProductModels = (0, mongoose_1.model)(DOCUMENT_NAME, productSchema);
exports.electronicModels = (0, mongoose_1.model)('electronics', electronicShecma);
exports.clothesModels = (0, mongoose_1.model)('clothes', clothingShecma);
//# sourceMappingURL=product.model.js.map