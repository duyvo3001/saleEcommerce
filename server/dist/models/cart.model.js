"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
// Declare the Schema of the Mongo model
const cartSchema = new mongoose_1.Schema({
    cart_state: {
        type: String,
        require: true,
        enum: ['active', 'complete', 'failed', 'pending'],
        default: 'active',
    },
    cart_products: {
        type: [], required: true, default: []
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, require: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
//Export the model
exports.cartModel = (0, mongoose_1.model)(DOCUMENT_NAME, cartSchema);
//# sourceMappingURL=cart.model.js.map