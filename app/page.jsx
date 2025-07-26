import CategoryCards from "@/components/category-cards";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto">
        <HeroSection />
        <div>
          <CategoryCards />
        </div>
      </div>
    </main>
  )
}