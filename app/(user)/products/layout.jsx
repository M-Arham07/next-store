
import Navbar from "@/components/navbar"
import SearchInput from "@/components/homepage/search-input"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function ProductLayout({ children }) {
  return (
    <>
      {/* Fixed Search Section - positioned below navbar */}
      <div className="sticky top-16 left-0 right-0 z-40 py-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <Suspense fallback={
            <div className="w-full max-w-xl mx-auto">
              <div className="relative mx-auto bg-white dark:bg-black/80 backdrop-blur-sm rounded-full overflow-hidden shadow-lg h-12 flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-black dark:text-white" />
                <span className="text-sm font-medium text-black dark:text-white">Loading...</span>
              </div>
            </div>
          }>
            <SearchInput />
          </Suspense>
        </div>
      </div>
      
      {/* Main Content - Add padding top to account for search bar */}
      <div className="pt-4">
        {children}
      </div>
    </>
  )
}
