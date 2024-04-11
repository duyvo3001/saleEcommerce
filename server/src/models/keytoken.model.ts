import mongoose, { Schema, Document, Model } from 'mongoose' // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
interface IKeyToken extends Document {
    user: mongoose.Types.ObjectId;
    publicKey: string;
    refreshToken: string[];
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
    refreshToken: {
        type: [String],
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
export const keytokenModel : Model<IKeyToken> = mongoose.model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema)
// export const keytokenModel: Model<IKeyToken> = mongoose.models.shop
