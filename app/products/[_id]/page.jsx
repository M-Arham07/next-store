import ProductInfoPage from "@/components/productinfo-page/product-info";
import GetProducts from "@/backend-utilities/GetProducts";
import UnavailableProduct from "@/components/productinfo-page/unavailable-product";
import Products from "@/backend-utilities/models/ProductModel";
import ConnectDB from "@/backend-utilities/ConnectDB";
import mongoose from "mongoose";

export default async function PRODUCT_INFO_PAGE({ params }) {
    let foundProduct;

    try {

        const awaitedParams = await params;
        const _id = awaitedParams?._id || null;
        console.log(_id)
        // will do this, if(!id || product_not_found_in_database ) then display product not found page

        await ConnectDB();
        foundProduct = await Products.findOne({ _id: _id});
        foundProduct=JSON.parse(JSON.stringify(foundProduct)) // This actually works lol
        console.log("FOUNDED PROD",foundProduct);



        // IF PRODUCT ISNT FOUND OR OUT OF STOCK:


        if (!foundProduct || !foundProduct?.isAvailable) {
            return <UnavailableProduct />
        }
    }
    catch (err) {
        // if theres some error still show UnavailableProduct
        console.error("error at products/[_id]/page.jsx",err.message);
        return <UnavailableProduct />
    }


    return <ProductInfoPage currentProduct={foundProduct} />
}