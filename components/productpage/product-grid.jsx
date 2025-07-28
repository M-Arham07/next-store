"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchInput from "../homepage/search-input";
import ProductCard from "./product-card";
import ProductNotFound from "./product-notfound";
export default function ProductGrid({ PRODUCTS }) {

    // INITIALIZE ROUTER
    const router = useRouter();


    const [FilteredProducts, setFilteredProducts] = useState([]);




    const searchParams = useSearchParams();

    useEffect(() => {
        const productName = searchParams?.get("name") || null;
        if (!productName) { console.log("NO params"); return };

        const filteredName = productName
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean);
        console.log("Searching for", filteredName);
        const filteredProducts = PRODUCTS.filter(product => {
            const normalizedTitle = product.title.toLowerCase().replace(/\s+/g, "");
            return filteredName.every(part => normalizedTitle.includes(part.replace(/\s+/g, "")))
        });
        setFilteredProducts(filteredProducts);
        return () => setFilteredProducts([]);


    }, [searchParams]);



    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Fixed Search Section - positioned below navbar (assumed navbar height) */}
            <div className="fixed top-16 left-0 right-0 z-40 py-4">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <SearchInput />
                </div>
            </div>
            {/* Products Grid - Add padding top to account for navbar + fixed search */}
            <div className="pt-32 px-2 sm:px-4 lg:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[0.6rem] sm:gap-4 lg:gap-6">


                    {

                        /*  IF SEARCH PARAMS EXIST AND There are no filtered products i.e No matching products,
                         display no product found to user  */


                        searchParams.get("name") && FilteredProducts.length === 0 ? (

                            <ProductNotFound searchedItem={searchParams.get("name")} />


                        ) :


                            /* if filtered products length is bigger then zero, map from filteredProducts 
                    else map from PRODUCTS
                    */


                            (FilteredProducts.length > 0 ? FilteredProducts : PRODUCTS).map((product) => (

                               
    
                             <Link href={` ${product?.isAvailable ? `/products/${product.id}` : '' }`} key={product.id} >
                                    <div className="w-full" >
                                        <ProductCard PRODUCT={product} addToCart={(x) => console.log("Added", x)} />
                                    </div>
                               </Link>
                            ))
                    }


                </div>
            </div>
        </div>
    )
}
