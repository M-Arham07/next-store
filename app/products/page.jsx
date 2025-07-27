import SearchInput from "@/components/homepage/search-input";
import ProductCard from "@/components/productpage/product-card";

export default function ProductGrid() {
  // Sample product data
  const products = [
    { id: 1, isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
    { id: 2, isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
    { id: 3, isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
    { id: 4, isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
    { id: 5, isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
    { id: 6, isAvailable: true, rating: 4.7, oldPrice: "$49.00" },
       { id: 1, isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
    { id: 2, isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
    { id: 3, isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
    { id: 4, isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
    { id: 5, isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
    { id: 6, isAvailable: true, rating: 4.7, oldPrice: "$49.00" },
       { id: 1, isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
    { id: 2, isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
    { id: 3, isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
    { id: 4, isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
    { id: 5, isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
    { id: 6, isAvailable: true, rating: 4.7, oldPrice: "$49.00" },
       { id: 1, isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
    { id: 2, isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
    { id: 3, isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
    { id: 4, isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
    { id: 5, isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
    { id: 6, isAvailable: true, rating: 4.7, oldPrice: "$49.00" },
  
  ]

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Fixed Search Section - positioned below navbar (assumed navbar height) */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <SearchInput />
        </div>
      </div>
      {/* Products Grid - Add padding top to account for navbar + fixed search */}
      <div className="pt-32 px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[0.6rem] sm:gap-4 lg:gap-6">
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard isAvailable={product.isAvailable} rating={product.rating} oldPrice={product.oldPrice} id={product.id} />
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}
