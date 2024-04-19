import mongoose, { Schema, Document, Model } from 'mongoose' 

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
interface IKeyToken extends Document {
    user: mongoose.Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshTokensUsed: [String];
    refreshToken: string;
}
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema<IKeyToken>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: [String],
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
export const keytokenModel: Model<IKeyToken> = mongoose.model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema)
// export const keytokenModel: Model<IKeyToken> = mongoose.models.shop
