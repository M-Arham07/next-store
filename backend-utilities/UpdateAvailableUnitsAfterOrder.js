"use server";

import { revalidateTag } from "next/cache";
import ConnectDB from "./ConnectDB";
import Products from "@/backend-utilities/models/ProductModel";



/*
  THIS FUNCTION DECREMENTS THE AVAILABLE UNITS OF PRODUCTS
  AFTER A SUCCESSFULL ORDER. IF ORDER IS CANCELLED, THE ORDERED
  UNITS ARE ADDED BACK TO AVAILABLE UNIT PROPERTY OF EACH PRODUCT
*/

export default async function UpdateAvailableUnitsAfterOrder(increment, orderedItems) {

  console.log("REceived ordered items",orderedItems)

  // if increment is false, it means product is ordered, if its true, it means product is cancelled

  try {

    await ConnectDB();


    /* To avoid sending individual calls for every single item, we will use bulk write
     to make an array of the operations, and then bulk perform them (bulk update qty) at once */
     
    const bulkOperations = orderedItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { availableUnits: increment ? item.qty : -item.qty } }
      }
    }));


    // console.log('PERFORMING BULK OPERATION:',JSON.stringify(bulkOperations))

    const updatedInfo = await Products.bulkWrite(bulkOperations);

    console.log("Updated Available Units success! Info:",updatedInfo);

  
    // REVALIDATE TAG FOR PRODUCTS

    revalidateTag("products");

    return true;



  }
  catch (err) {
    console.error(`
      Error while updating available products at UpdateAvailableUnitsAfterOrder! Logs:",${err?.message}
      `);
     throw new Error(err.message);
  }

}