
import SearchInput from "@/components/homepage/search-input";
import ProductCard from "@/components/productpage/product-card";
import ProductGrid from "@/components/productpage/product-grid";
 const products = [
  { id: 1, title: "iPhone 15 Pro", isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
  { id: 2, title: "Samsung Galaxy S24", isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
  { id: 3, title: "Google Pixel 8", isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
  { id: 4, title: "OnePlus 12", isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
  { id: 5, title: "Sony Xperia 5", isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
  { id: 6, title: "Xiaomi Mi 13", isAvailable: true, rating: 4.7, oldPrice: "$49.00" },

  { id: 7, title: "Apple Watch Series 9", isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
  { id: 8, title: "Samsung Galaxy Watch 6", isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
  { id: 9, title: "Fitbit Versa 4", isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
  { id: 10, title: "Garmin Fenix 7", isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
  { id: 11, title: "Fossil Gen 6", isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
  { id: 12, title: "Amazfit GTR 4", isAvailable: true, rating: 4.7, oldPrice: "$49.00" },

  { id: 13, title: "Dell XPS 15", isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
  { id: 14, title: "MacBook Pro 16", isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
  { id: 15, title: "HP Spectre x360", isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
  { id: 16, title: "Lenovo ThinkPad X1", isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
  { id: 17, title: "Asus ROG Zephyrus", isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
  { id: 18, title: "Microsoft Surface Laptop", isAvailable: true, rating: 4.7, oldPrice: "$49.00" },

  { id: 19, title: "Sony WH-1000XM5", isAvailable: true, rating: 4.5, oldPrice: "$45.00" },
  { id: 20, title: "Bose QuietComfort 45", isAvailable: true, rating: 4.2, oldPrice: "$52.00" },
  { id: 21, title: "Sennheiser HD 560S", isAvailable: false, rating: 4.8, oldPrice: "$48.00" },
  { id: 22, title: "Apple AirPods Max", isAvailable: true, rating: 4.6, oldPrice: "$55.00" },
  { id: 23, title: "JBL Club One", isAvailable: true, rating: 4.3, oldPrice: "$42.00" },
  { id: 24, title: "Bang & Olufsen Beoplay H95", isAvailable: true, rating: 4.7, oldPrice: "$49.00" },
];

export default function ProdutPage(){
  return <ProductGrid PRODUCTS={products}/>
}