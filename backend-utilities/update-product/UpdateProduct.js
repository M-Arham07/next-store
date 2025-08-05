"use server";

import ConnectDB from "@/backend-utilities/ConnectDB";
import mongoose from "mongoose";
import Products from "@/backend-utilities/models/ProductModel";
import { revalidateTag } from "next/cache";


export default async function UpdateProduct(_id, updatedProductData) {
    console.log("RECEIEVD", updatedProductData)

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error("Invalid ObjectID!");

    try {
        await ConnectDB();
        const updated = await Products.findByIdAndUpdate(
            { _id: _id },
            { $set: updatedProductData },
            { new: true }
        );
        console.log("UPDATED PRODUCT:", updated);

        // REFRESH CACHE:

        revalidateTag('products');

        return true;


    }
    catch (err) {
        console.error("Error while updating product at UpdateProduct! Logs:", err.message);
        return false;

    }


}