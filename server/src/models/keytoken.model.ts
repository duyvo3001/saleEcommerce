import mongoose, { Schema } from 'mongoose' // Erase if already required

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
const keytokenModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema);

export default keytokenModel