

import { Search, Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CNoProductFound({searchedItem}) {




  return (
    <div className="col-span-full flex flex-col items-center justify-center mt-1">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">No products found</h3>

      {/* Search Query Display */}
      {1 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
          We couldn't find any products matching "{searchedItem}"
        </p>
      )}

      {/* Suggestions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
        <p className="mb-2">Try adjusting your search:</p>
        <ul className="space-y-1">
          <li>• Check your spelling</li>
          <li>• Use fewer or different keywords</li>
          <li>• Try more general terms</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
     
      <Link href='/products'>
        <Button  className="flex items-center gap-2 cursor-pointer">
          
          Browse all products
        </Button></Link>
      </div>
    </div>
  )
}
