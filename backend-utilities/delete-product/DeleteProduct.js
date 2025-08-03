"use server";
import mongoose from "mongoose";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Products from "@/backend-utilities/models/ProductModel";
import { revalidateTag } from "next/cache";



export default async function DeleteProduct(productID) {
    console.log(productID)

    try {

        if (!mongoose.Types.ObjectId.isValid(productID)) throw new Error(`Received Invalid ProductID:${productID}`)

        await ConnectDB();
        await Products.findByIdAndDelete(productID); // DELETE PRODUCT BY ID


        // REFRESH THE CACHE 
        revalidateTag('products');
        console.log("DELETED",productID,"SUCCESSFULLY!\n")

        return true;

    }
    catch (err) {
        console.error("Error deleting product by id at DeleteProduct! Logs:", err.message);
        return false;

    }





}