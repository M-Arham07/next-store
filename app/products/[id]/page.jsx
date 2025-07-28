import ProductInfoPage from "@/components/productinfo-page/product-info";
import { products } from "../page";
import UnavailableProduct from "@/components/productinfo-page/unavailable-product";

export default async function PRODUCT_INFO_PAGE({ params }) {
    const awaitedParams = await params;
    const id = awaitedParams?.id || null;
    // will do this, if(!id || product_not_found_in_database ) then displat product not found page

    


    // currently for testing purpose only!
    
    let currentProduct=products.filter((product)=>product.id === parseInt(id) && product?.isAvailable)
    console.log(currentProduct)



    if(currentProduct.length === 0) return <UnavailableProduct />

    // TO CONVERT SINGLE PRODUCT OBJECT ARRAY INTO AN OBJECT
    currentProduct=currentProduct[0];
   






    return <ProductInfoPage currentProduct={currentProduct} />
}