
import SearchInput from "@/components/homepage/search-input";
import ProductCard from "@/components/productpage/product-card";
import ProductGrid from "@/components/productpage/product-grid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const products = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    isAvailable: true,
    rating: 4.5,
    price: 999,
    oldPrice: 45,
    description: "Experience the new iPhone!",
    category: "Smartphones",
    images: ['/iphone15promax.jpeg']
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    isAvailable: true,
    rating: 5,
    price: 1000,
    oldPrice: 899,
    category: "Smartphones",
    description: "200MP Camera",
    images: ['/s24u.jpg', '/s24U2.jpg', '/s24u3.jpg', '/s24u4.jpg']
  },
  {
    id: 3,
    title: "Google Pixel 8",
    isAvailable: false,
    rating: 4.8,
    price: 499,
    oldPrice: 48,
    category: "Smartphones"
  },
  {
    id: 4,
    title: "OnePlus 12",
    isAvailable: true,
    rating: 4.6,
    price: 599,
    oldPrice: 55,
    category: "Smartphones"
  },
  {
    id: 5,
    title: "Sony Xperia 5",
    isAvailable: true,
    rating: 4.3,
    price: 549,
    oldPrice: 42,
    category: "Smartphones"
  },
  {
    id: 6,
    title: "Xiaomi Mi 13",
    isAvailable: true,
    rating: 4.7,
    price: 499,
    oldPrice: 49,
    category: "Smartphones"
  },
  {
    id: 7,
    title: "Apple Watch Series 9",
    isAvailable: true,
    rating: 4.5,
    price: 399,
    oldPrice: 45,
    category: "Wearables"
  },
  {
    id: 8,
    title: "Samsung Galaxy Watch 6",
    isAvailable: true,
    rating: 4.2,
    price: 349,
    oldPrice: 52,
    category: "Wearables"
  },
  {
    id: 9,
    title: "Fitbit Versa 4",
    isAvailable: false,
    rating: 4.8,
    price: 199,
    oldPrice: 48,
    category: "Wearables"
  },
  {
    id: 10,
    title: "Garmin Fenix 7",
    isAvailable: true,
    rating: 4.6,
    price: 599,
    oldPrice: 55,
    category: "Wearables"
  },
  {
    id: 11,
    title: "Fossil Gen 6",
    isAvailable: true,
    rating: 4.3,
    price: 299,
    oldPrice: 42,
    category: "Wearables"
  },
  {
    id: 12,
    title: "Amazfit GTR 4",
    isAvailable: true,
    rating: 4.7,
    price: 249,
    oldPrice: 49,
    category: "Wearables"
  },
  {
    id: 13,
    title: "Dell XPS 15",
    isAvailable: true,
    rating: 4.5,
    price: 1499,
    oldPrice: 45,
    category: "Laptops"
  },
  {
    id: 14,
    title: "MacBook Pro 16",
    isAvailable: true,
    rating: 4.2,
    price: 2399,
    oldPrice: 52,
    category: "Laptops"
  },
  {
    id: 15,
    title: "HP Spectre x360",
    isAvailable: false,
    rating: 4.8,
    price: 1399,
    oldPrice: 48,
    category: "Laptops"
  },
  {
    id: 16,
    title: "Lenovo ThinkPad X1",
    isAvailable: true,
    rating: 4.6,
    price: 1299,
    oldPrice: 55,
    category: "Laptops"
  },
  {
    id: 17,
    title: "Asus ROG Zephyrus",
    isAvailable: true,
    rating: 4.3,
    price: 1599,
    oldPrice: 42,
    category: "Laptops"
  },
  {
    id: 18,
    title: "Microsoft Surface Laptop",
    isAvailable: true,
    rating: 4.7,
    price: 1399,
    oldPrice: 49,
    category: "Laptops"
  },
  {
    id: 19,
    title: "Sony WH-1000XM5",
    isAvailable: true,
    rating: 4.5,
    price: 399,
    oldPrice: 45,
    category: "Headphones"
  },
  {
    id: 20,
    title: "Bose QuietComfort 45",
    isAvailable: true,
    rating: 4.2,
    price: 329,
    oldPrice: 52,
    category: "Headphones"
  },
  {
    id: 21,
    title: "Sennheiser HD 560S",
    isAvailable: false,
    rating: 4.8,
    price: 199,
    oldPrice: 48,
    category: "Headphones"
  },
  {
    id: 22,
    title: "Apple AirPods Max",
    isAvailable: true,
    rating: 4.6,
    price: 549,
    oldPrice: 55,
    category: "Headphones"
  },
  {
    id: 23,
    title: "JBL Club One",
    isAvailable: true,
    rating: 4.3,
    price: 299,
    oldPrice: 42,
    category: "Headphones"
  },
  {
    id: 24,
    title: "Bang & Olufsen Beoplay H95",
    isAvailable: true,
    rating: 4.7,
    price: 899,
    oldPrice: 49,
    category: "Headphones"
  }
];

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-black dark:text-white" />
          <span className="text-base font-medium text-black dark:text-white">Loading products...</span>
        </div>
      </div>
    }>
      <ProductGrid PRODUCTS={products} />
    </Suspense>
  )
}