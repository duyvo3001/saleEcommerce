"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apikeyModel = void 0;
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';
// Declare the Schema of the Mongo model
const apikeySchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
//Export the model
exports.apikeyModel = (0, mongoose_1.model)(DOCUMENT_NAME, apikeySchema);
//# sourceMappingURL=apikey.model.js.map