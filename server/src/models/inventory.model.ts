import { Schema, model, Types } from "mongoose";


const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const InventorySchema = new Schema({
    inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inventory_location: { type: String, default: 'unKnown' },
    inventory_Stock: { type: Number, require: true },
    inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inventory_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
export const InventoryModels = model(DOCUMENT_NAME, InventorySchema);
