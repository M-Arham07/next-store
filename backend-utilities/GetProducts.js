// THIS UITLITY WILL ONLY BE IMPORTED IN SERVER COMPONENTS SO NO NEED TO MARK IT USE SERVER


// THE unstable_cache CACHES THE RESULT OF THIS FUNCTION (database call), and revalidates after 60 seconds  
// THE TAGS CAN BE USED TO REVALIDATE RESULT OF THIS MANUALLY  (BEFORE 60 SEC) LIKE WHEN SOMETHING UPDATE

import mongoose from "mongoose";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Products from "@/backend-utilities/models/ProductModel";
import { unstable_cache } from "next/cache";

const GetProducts = unstable_cache(async () => {
    await ConnectDB();
    let products = await Products.find();

    // CONVERTS INTO JAVASCRIPT OBJECT:
    products=JSON.parse(JSON.stringify(products));
    return products;
}, ['products'],
    { tags: ['products'] }
);
export default GetProducts;