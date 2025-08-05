import getProductById from "@/backend-utilities/getProductById";
import EditProductPage from "@/components/admin/edit-productpage/edit-product-page";
import UnavailableProduct from "@/components/productinfo-page/unavailable-product";



export default async function EDIT_PRODUCT_PAGE({ params }) {



    const awaitedParams = await params;
    const _id = awaitedParams?._id;
    const foundProduct = await getProductById(_id);
    if (!foundProduct) {
        // RETURN UNAVAILABLE PRODUCT PAGE
        const TIPS= ["Check spellings","Try reloading the page","Contact Tech Support"]
        return <UnavailableProduct
            linkHref="/admin/products"
            TIPS={TIPS}
        />
    }


    return <EditProductPage currentProduct={foundProduct} />

}