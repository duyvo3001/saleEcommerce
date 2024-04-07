// import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'

// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        maxLength : 150
    },
    email:{
        type:String,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default : 'inactive'
    },
    verrify:{
        type:Schema.Types.Boolean,
        default:false
    },
    roles:{
        type:Array,
        default:[]
    },
},
{
    timestamps : true,
    collection: COLLECTION_NAME
}
);

//Export the model
const shopModel = mongoose.model(DOCUMENT_NAME, shopSchema);

export default shopModel