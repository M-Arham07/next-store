import ProductInfoPage from "@/components/productinfo-page/product-info";
import UnavailableProduct from "@/components/productinfo-page/unavailable-product";
import GetProductById from "@/backend-utilities/GetProductById";



export default async function PRODUCT_INFO_PAGE({ params }) {
    


        const awaitedParams = await params;
        const _id = awaitedParams?._id || null;
      
        const foundProduct = await GetProductById(_id);

        // IF PRODUCT ISNT FOUND OR OUT OF STOCK:



        // TODO: ALSO ADD if availableUnits condition?
        if (!foundProduct || !foundProduct?.isAvailable) {
            return <UnavailableProduct />
        }
    


    return <ProductInfoPage currentProduct={foundProduct} />
}