import mongoose from "mongoose";
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
    }
    
});

export default mongoose.models.Product || mongoose.model("Product",productSchema);