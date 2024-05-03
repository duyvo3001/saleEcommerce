import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

interface IProduct extends Document {
    product_name: String,
    product_thump: String,
    product_description: String,
    product_Price: Number,
    product_quantity: Number,
    product_type: [String],
    product_shop : String,
    product_attributes : Schema.Types.Mixed
}

// Declare the Schema of the Mongo model
const productSchema = new Schema<IProduct>({
    product_name: { type: String, required: true, },
    product_thump: { type: String, required: true, },
    product_description: String,
    product_Price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: [String], required: true, enum: ['Electionics', 'Clothing', 'furniture'] },
    product_shop: String , 
    product_attributes: { type: Schema.Types.Mixed, required: true, },
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });

//Export the model

const clothingShecma = new Schema({
    brand : {type:String, required: true},
    size : String,
    material : String
},{
    collection: 'clothes',
    timestamps: true,
})
const electronicShecma = new Schema({
    brand : {type:String, required: true},
    size : String,
    material : String
},{
    collection: 'electronics',
    timestamps: true,
})

export const ProductModels = model(DOCUMENT_NAME, productSchema);
export const electronicModels = model('electronics', electronicShecma);
export const clothesModels = model('clothes', clothingShecma);