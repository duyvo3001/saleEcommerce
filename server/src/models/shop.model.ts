// import { timeStamp } from "console";
import mongoose, { Schema, Document, Model } from "mongoose";

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'
interface IShop extends Document {
    name: string;
    email: string;
    password: string;
    status: string;
    verrify: Schema.Types.Boolean;
    roles : [String];
    phone: string;
    failedLoginAttempts:number;
    isLocked:Boolean;
    unlockCode :string;
}
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verrify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    unlockCode: {
        type: String,
        default: null
    }
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

//Export the model
export const shopModel: Model<IShop> = mongoose.model<IShop>(DOCUMENT_NAME, shopSchema);
