import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

interface IKeyApi extends Document {
    key: String,
    status: Boolean,
    permissions: string[];
}

// Declare the Schema of the Mongo model
const apikeySchema = new Schema<IKeyApi>({
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
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });

//Export the model
export const apikeyModel = model(DOCUMENT_NAME, apikeySchema);