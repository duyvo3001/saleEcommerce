import { NextFunction } from "express";
import { Schema, model, Types } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

interface IProduct extends Document {
    product_name: string,
    product_thump: String,
    product_slug: String,
    product_description: String,
    product_Price: Number,
    product_quantity: Number,
    product_type: [String],
    product_shop: String,
    product_attributes: Schema.Types.Mixed,
    product_RatingAverage: Number,
    product_Variation: [String],
    isDraft: Boolean,
    isPublish: Boolean
}


// Declare the Schema of the Mongo model
const productSchema = new Schema<IProduct>({
    product_name: { type: String, required: true, },
    product_thump: { type: String, required: true, },
    product_description: String,
    product_slug: String,
    product_Price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: [String], required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: Types.ObjectId,
    product_attributes: { type: Schema.Types.Mixed, required: true, },
    product_RatingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 1.0'],
        set: (val: number) => Math.round(val * 10) / 10
    },
    product_Variation: { type: [String], default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });

/*
    * create index for search      
*/
productSchema.index({ product_name: 'text', product_description: 'text' })

/*
    * document middleware : run before .save() and .create() 
*/
productSchema.pre('save', async function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    product_shop: Types.ObjectId,
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true,
})
const electronicSchecma = new Schema({
    brand: { type: String, required: true },
    product_shop: Types.ObjectId,
    size: String,
    material: String
}, {
    collection: 'electronics',
    timestamps: true,
})
const furnitureSchecma = new Schema({
    brand: { type: String, required: true },
    product_shop: Types.ObjectId,
    size: String,
    material: String
}, {
    collection: 'furniture',
    timestamps: true,
})
export const ProductModels = model(DOCUMENT_NAME, productSchema);
export const electronicModels = model('electronics', electronicSchecma);
export const clothesModels = model('clothes', clothingSchema);
export const furnitureModels = model('furniture', furnitureSchecma);