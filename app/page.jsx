import CategoryCards from "@/components/homepage/category-cards";
import HeroSection from "@/components/homepage/hero-section";
import SearchInput from "@/components/homepage/search-input";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SearchInput  />
      <div className="container mx-auto">
        <HeroSection />
        <div>
          <CategoryCards />
        </div>
      </div>
    </main>
  )
}