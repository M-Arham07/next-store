
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String
    },
    cart:{
        type:[mongoose.Schema.Types.Mixed], // MIXED IS EQUAL TO :any in JS/TS
        // MEANS CART CAN STORE ANY VALUE (CUZ I DONT WANT TO DEFINE ANOTHER BIG SCHEMA)
        default:[] //sets a default empty array for cart
    }
},{collection:"users"});

export default mongoose.models.User || mongoose.model("User",userSchema);