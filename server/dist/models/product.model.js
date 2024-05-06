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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.furnitureModels = exports.clothesModels = exports.electronicModels = exports.ProductModels = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
// Declare the Schema of the Mongo model
const productSchema = new mongoose_1.Schema({
    product_name: { type: String, required: true, },
    product_thump: { type: String, required: true, },
    product_description: String,
    product_slug: String,
    product_Price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: [String], required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: mongoose_1.Types.ObjectId,
    product_attributes: { type: mongoose_1.Schema.Types.Mixed, required: true, },
    product_RatingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 1.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_Variation: { type: [String], default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
/*
    * document middleware : run before .save() and .create()
*/
productSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.product_slug = (0, slugify_1.default)(this.product_name, { lower: true });
        next();
    });
});
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