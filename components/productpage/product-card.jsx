"use client"
import Image from "next/image"
import { Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"


export default function ProductCard({PRODUCT, addToCart}) {

  const { isAvailable = true, rating = 4.5, oldPrice = "$45.00", image = '/s24u.jpg', id, title:name , category } = PRODUCT;
  

  return (
    <div
      className={`bg-white dark:bg-black rounded-lg sm:rounded-xl 
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
      dark:shadow-[0_8px_30px_rgb(255,255,255,0.04)] 
      h-full flex flex-col transform transition-all duration-300 
      hover:scale-[1.02] 
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] 
      dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.2)] 
      overflow-hidden ${!isAvailable ? "opacity-75" : ""}`}
    >
      {/* Product Image - Full Width Upper Section */}
      <div className="relative h-32 sm:h-40 md:h-44 flex-shrink-0">
        <Image
          src={image}
          alt="Snickers Off-White 2024 sneaker"
          width={240}
          height={200}
          className={`w-full h-full object-cover transition-transform duration-500 ${isAvailable ? "hover:scale-110" : "grayscale"}`}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <div className="flex-1 pr-1 sm:pr-2">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-[#252b42] dark:text-white leading-tight line-clamp-2 mb-1">
                {name}
              </h2>
              <p className="text-[#737373] dark:text-gray-400 text-[10px] sm:text-xs font-medium tracking-wide uppercase">
                {category}
              </p>
            </div>
            {/* Add Button */}
            <Button
              size="icon" onClick={(e)=>{e.preventDefault(); addToCart(id)}}
              disabled={!isAvailable}
              className={`w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full shadow-lg flex-shrink-0 transform transition-all duration-300 ${isAvailable
                  ? "bg-[#1a1a1a] hover:bg-[#2e2e2e] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:scale-110 cursor-pointer"
                  : "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                }`}

            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          {/* Price Section */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-1 sm:mb-2">
            <p className="text-sm sm:text-lg md:text-xl font-bold text-[#252b42] dark:text-white">$38.00</p>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-gray-400 line-through">{oldPrice}</p>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold">
              16% off
            </span>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1 sm:mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium text-[#252b42] dark:text-white">{rating}</span>
            <span className="text-[10px] sm:text-xs text-[#737373] dark:text-gray-400">(124)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
