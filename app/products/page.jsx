
import SearchInput from "@/components/homepage/search-input";
import ProductCard from "@/components/productpage/product-card";
import ProductGrid from "@/components/productpage/product-grid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import GetProducts from "@/backend-utilities/GetProducts";


export default async function ProductPage() {
  let products=[];
  try{
  products=await GetProducts();
  }
  catch(err){
    console.error("ERROR WHILE FETCHING PRODUCTS, LOGS:",err);
  }
 

  return (  
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-black dark:text-white" />
          <span className="text-base font-medium text-black dark:text-white">Loading products...</span>
        </div>
      </div>
    }>
      <ProductGrid PRODUCTS={products} />
    </Suspense>
  )
}