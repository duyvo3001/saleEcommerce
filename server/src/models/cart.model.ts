import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
const cartSchema = new Schema({
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
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });

//Export the model
export const cartModel = model(DOCUMENT_NAME, cartSchema);