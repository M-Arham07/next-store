import mongoose from "mongoose";
import { type } from "os";
const Schema=mongoose.Schema;

const productSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    isAvailable:{
        type:Boolean,
        required:true
    },
    rating:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        required:true
    },
    oldPrice:{
        type:Number,
        required:true
    },
    description:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    images:{
        type:[String]
    },
    availableUnits:{
        type:Number,
        required:true
    }
    
},{collection:"products",timestamps:true});

export default mongoose.models.Product || mongoose.model("Product",productSchema);