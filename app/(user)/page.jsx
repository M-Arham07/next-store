import CategoryCards from "@/components/homepage/category-cards";
import HeroSection from "@/components/homepage/hero-section";
import SearchInput from "@/components/homepage/search-input";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="w-full max-w-xl mx-auto px-4 sm:px-0 py-2">
          <div className="relative mx-auto bg-white dark:bg-black/80 backdrop-blur-sm rounded-full overflow-hidden shadow-lg h-12 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-black dark:text-white" />
            <span className="text-sm font-medium text-black dark:text-white">Loading...</span>
          </div>
        </div>
      }>
        <SearchInput />
      </Suspense>
      <div className="container mx-auto">
        <HeroSection />
        <div>
          <CategoryCards />
        </div>
      </div>
    </main>
  )
}