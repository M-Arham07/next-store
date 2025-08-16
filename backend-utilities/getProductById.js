// NO USE SERVER CUZ THIS WILL ONLY BE USED IN SERVER COMPOENNTS:

import ConnectDB from "@/backend-utilities/ConnectDB";
import mongoose, { Mongoose } from "mongoose";
import Products from "@/backend-utilities/models/ProductModel";


export default async function GetProductById(_id) {


    try {
        
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error("Invalid ObjectID");
        await ConnectDB();
        let foundProduct = await Products.findOne({ _id: _id });
        foundProduct = JSON.parse(JSON.stringify(foundProduct)) // This actually works lol

        return foundProduct;
    }
    catch (err) {
        console.error("Error finding product having _id", _id, "at getProductbyId! Logs:", err.message);
        return false;
    }

}