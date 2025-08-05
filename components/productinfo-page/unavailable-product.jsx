import { Package, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function UnavailableProduct({
  linkHref='/products',
  TIPS = ["Browse our other available products","Check back later for availability","Contact us for more information"]

}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center mt-1 px-4">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Product Not Available</h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
        The product you're looking for is currently not available right now
      </p>

      {/* Suggestions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
        <p className="mb-2">What you can do:</p>
        <ul className="space-y-1">
          {
            TIPS.map((tip,index)=><li key={index}>• {tip} </li>)
          }
          
        
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Link href={linkHref}>
          <Button className="flex items-center gap-2 cursor-pointer">Browse Other Products</Button>
        </Link>
      </div>
    </div>
  )
}
