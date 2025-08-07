import ProductInfoPage from "@/components/productinfo-page/product-info";
import GetProducts from "@/backend-utilities/GetProducts";
import UnavailableProduct from "@/components/productinfo-page/unavailable-product";
import Products from "@/backend-utilities/models/ProductModel";
import getProductById from "@/backend-utilities/GetProductById";



export default async function PRODUCT_INFO_PAGE({ params }) {
    


        const awaitedParams = await params;
        const _id = awaitedParams?._id || null;
      
        const foundProduct = await getProductById(_id);

        // IF PRODUCT ISNT FOUND OR OUT OF STOCK:


        if (!foundProduct || !foundProduct?.isAvailable) {
            return <UnavailableProduct />
        }
    


    return <ProductInfoPage currentProduct={foundProduct} />
}