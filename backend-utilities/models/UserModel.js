
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
        type:[String]
    }
});

export default mongoose.models.User || mongoose.model("User",userSchema);