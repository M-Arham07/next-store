"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import ProductCard from "./product-card";
import ProductNotFound from "./product-notfound";


export default function ProductGrid({ PRODUCTS }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const query = searchParams?.get("name");
        
        if (query) {
            const filteredName = query
                .toLowerCase()
                .trim()
                .split(/\s+/)
                .filter(Boolean);
                
            const filtered = PRODUCTS.filter(product => {
                const normalizedTitle = product.title.toLowerCase().replace(/\s+/g, "");
                return filteredName.every(part => normalizedTitle.includes(part.replace(/\s+/g, "")));
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(PRODUCTS);
        }
        
        // Small delay to prevent flash
        const timer = setTimeout(() => setIsLoading(false), 0.0000000000001);
        return () => clearTimeout(timer);
    }, [searchParams, PRODUCTS]);


    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="px-2 sm:px-4 lg:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[0.6rem] sm:gap-4 lg:gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center items-center min-h-[200px]">
                            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
                        </div>
                    ) : searchParams.get("name") && filteredProducts.length === 0 ? (
                        <div className="col-span-full">
                            <ProductNotFound searchedItem={searchParams.get("name")} />
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <Link 
                                href={`${product?.isAvailable ? `/products/${product.id}` : ''}`} 
                                key={product.id}
                            >
                                <div className="w-full">
                                    <ProductCard 
                                        PRODUCT={product} 
                                    />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
