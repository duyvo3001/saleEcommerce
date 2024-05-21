"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountModels = void 0;
const mongoose_1 = require("mongoose");
/*
    * advanced options
*/
const DOCUMENT_NAME = 'discount';
const COLLECTION_NAME = 'discounts';
const DiscountSchema = new mongoose_1.Schema({
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: 'fixed_amount' }, //percentage
    discount_value: { type: Number, require: true }, //10.00 , 10
    discount_code: { type: String, require: true },
    discount_start_date: { type: Date, require: true }, // start date
    discount_end_date: { type: Date, require: true }, //end date
    discount_max_uses: { type: Number, require: true }, // so luong discount duoc ap dung
    discount_uses_count: { type: Number, require: true }, // so luong discount da duoc su dung
    discount_user_uses: { type: Array, default: [] }, // user da su dung
    discount_max_uses_per_users: { type: Number, require: true }, // so luong cho phep toi da moi user
    discount_min_order_value: { type: Number, require: true }, // 
    discount_shopId: { type: mongoose_1.Types.ObjectId, ref: 'Shop' }, // 
    discount_is_active: { type: Boolean, default: true }, // 
    discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] }, // 
    discount_product_ids: { type: Array, require: true, default: [] }, // 
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
exports.discountModels = (0, mongoose_1.model)(DOCUMENT_NAME, DiscountSchema);
//# sourceMappingURL=discount.model.js.map