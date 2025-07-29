
"use client";

/*
* THIS BUTTON IS FOR THE SOLE PURPOSE OF TRIGGERING THE useCart State, THIS WILL BE IMPORTED IN THE
* PRODUCT CARD COMPONENT TO AVOID MAKING PRODUCT CARD A CLIENT COMPONENT
*/
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { Plus } from "lucide-react";


export default function AddtoCartButton({ currentProduct }) {

    const isAvailable = currentProduct?.isAvailable
    return (
        
            <Button
                size="icon" onClick={(e) => { e.preventDefault(); addItem(currentProduct); console.log("Added ", currentProduct) }}
                disabled={!isAvailable}
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full shadow-lg flex-shrink-0 transform transition-all duration-300 ${isAvailable
                    ? "bg-[#1a1a1a] hover:bg-[#2e2e2e] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:scale-110 cursor-pointer"
                    : "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    }`}

            >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Button>
       
    );
}