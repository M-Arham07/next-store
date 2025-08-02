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
        required:true
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
    quantity:{
        type:Boolean,
        required:true

    },
    selected:{
        type:Boolean,
        required:true

    }
    
},{collection:"products"});

export default mongoose.models.Product || mongoose.model("Product",productSchema);