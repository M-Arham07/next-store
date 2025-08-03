"use server";

import ConnectDB from "@/backend-utilities/ConnectDB";
import mongoose from "mongoose";
import Product from "@/backend-utilities/models/ProductModel";
import ValidateProduct from "@/lib/ValidateProduct";
import { revalidateTag } from "next/cache";


export default async function SaveProductToDB(productData) {
    console.log("TRYING TO INSERT",productData);


    try {

        const isValid = ValidateProduct(productData);
        if (!isValid) throw new Error("Invalid Product Data!")

        await ConnectDB();
        //if theres are error creating product it will throw an error that will be catched!


        await Product.create(productData); // WILL DIRECTLY INSERT PRODUCT DATA HERE!


        // REFRESHES THE CACHE OF tag: products!
        revalidateTag('products');

        return true;


    }
    catch (err) {
        console.error("Error while saving product to database at SaveProductToDB! Logs:", err.message);

        return false;



    }





}