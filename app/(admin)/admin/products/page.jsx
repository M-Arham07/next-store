import GetProducts from "@/backend-utilities/GetProducts";
import ManageProductsPage from "@/components/admin/manage-products/manage-products-page";


export default async function MANAGE_PRODUCTS_PAGE(){

  const products = await GetProducts();


  return <ManageProductsPage products={products} />
}