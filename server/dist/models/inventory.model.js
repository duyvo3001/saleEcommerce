"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModels = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
const InventorySchema = new mongoose_1.Schema({
    inventory_productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
    inventory_location: { type: String, default: 'unKnown' },
    inventory_Stock: { type: Number, require: true },
    inventory_shopId: { type: String, ref: 'Shop' },
    inventory_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
exports.InventoryModels = (0, mongoose_1.model)(DOCUMENT_NAME, InventorySchema);
//# sourceMappingURL=inventory.model.js.map