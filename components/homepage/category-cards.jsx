"use client"

import { SpotlightCard } from "@/components/ui/custom-ui/spotlight-card";
import { ShoppingBag, Smartphone, Gamepad2, Car, Shirt, Book, Coffee, Home } from "lucide-react"
import { useEffect, useRef } from "react"
import Image from "next/image"

export default function ProductCategories() {
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target) // Stop observing once animation is triggered
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px' // Start animation slightly before the element enters viewport
      }
    )

    const elements = document.querySelectorAll('.animate-slide-up')
    elements.forEach((el) => observer.observe(el))

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  const categories = [
    {
      id: 1,
      name: "Mobile Phones",
      description: "Experience the latest flagships with leading performance",
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=250&fit=crop&crop=center",
      icon: Smartphone,
      itemCount: "10+ variants",
      delay: "0ms",
    },
    {
      id: 2,
      name: "Laptops",
      description: "Premium laptops featuring MacBooks and high-end ultrabooks",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop&crop=center",
      icon: Smartphone,
      itemCount: "50+ models",
      delay: "50ms",
    },
    {
      id: 3,
      name: "Wearables",
      description: "Smart watches, fitness trackers, and wireless earbuds",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=250&fit=crop&crop=center",
      icon: Smartphone,
      itemCount: "800+ items",
      delay: "100ms",
    },
    {
      id: 4,
      name: "Accessories",
      description: "Cases, chargers, screen protectors, and more",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=250&fit=crop&crop=center",
      icon: Smartphone,
      itemCount: "1,500+ items",
      delay: "150ms",
    },
    {
      id: 5,
      name: "Gaming",
      description: "Gaming consoles, accessories, and the latest titles",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop&crop=center",
      icon: Gamepad2,
      itemCount: "1,200+ items",
      delay: "200ms",
    },
    {
      id: 6,
      name: "Home & Garden",
      description: "Furniture, decor, and everything for your home",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&crop=center",
      icon: Home,
      itemCount: "3,800+ items",
      delay: "250ms",
    },
    {
      id: 7,
      name: "Fashion",
      description: "Trendy clothing, shoes, and accessories",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&crop=center",
      icon: Shirt,
      itemCount: "5,600+ items",
      delay: "300ms",
    },
    {
      id: 8,
      name: "Automotive",
      description: "Car parts, accessories, and maintenance tools",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop&crop=center",
      icon: Car,
      itemCount: "890+ items",
      delay: "400ms",
    },
    {
      id: 9,
      name: "Books & Media",
      description: "Books, audiobooks, movies, and educational content",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop&crop=center",
      icon: Book,
      itemCount: "12,000+ items",
      delay: "500ms",
    },
  ]

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Shop by Category
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Discover amazing products across all categories. Browse through our carefully curated selection.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.id}
                className="animate-slide-up mt-8 first:mt-0 sm:mt-0"
              >
                <SpotlightCard 
                  className="h-72 sm:h-80 cursor-pointer group transition-all duration-300 hover:scale-[1.02] active:scale-[1.02] focus:scale-[1.02] hover:shadow-lg active:shadow-lg focus:shadow-lg p-4 sm:p-6"
                  tabIndex={0}
                >
                  <div className="relative z-20 h-full flex flex-col">
                    {/* Category Image */}
                    <div className="relative h-36 sm:h-32 mb-3 sm:mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110 group-active:scale-110 group-focus:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={category.id <= 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-sm border border-border/50">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary group-active:text-primary group-focus:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-primary font-medium text-xs sm:text-sm">{category.itemCount}</span>
                        <div className="flex items-center text-muted-foreground group-hover:text-primary group-active:text-primary group-focus:text-primary transition-colors">
                          <span className="text-xs sm:text-sm font-medium mr-1 sm:mr-2">Explore</span>
                          <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            )
          })}
        </div>

        {/* Featured Banner */}
        <div className="mt-12 sm:mt-16 animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
          {/* Mobile Version */}
          <div className="sm:hidden space-y-4 px-2 py-10">
            <div className="text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
              <h2 className="text-2xl font-bold text-foreground">
                Special Offers & Deals
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Don't miss out on our limited-time offers across all categories
              </p>
            </div>
            <div className="flex justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <button className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 text-sm shadow-lg flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                View All Deals
              </button>
            </div>
          </div>
          
          {/* Desktop Version */}
          <div className="hidden sm:block">
            <SpotlightCard className="h-auto min-h-[120px] sm:h-32 p-4 sm:p-6 shadow-lg bg-black dark:bg-white border-black dark:border-white animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="relative z-20 h-full flex flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-black mb-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
                    Special Offers & Deals
                  </h2>
                  <p className="text-white/80 dark:text-black/80 text-sm sm:text-base animate-slide-up" style={{ animationDelay: "300ms" }}>
                    Don't miss out on our limited-time offers across all categories
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Coffee className="w-8 h-8 text-white dark:text-black animate-slide-up" style={{ animationDelay: "400ms" }} />
                  <button className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 text-base shadow-lg animate-slide-up" style={{ animationDelay: "500ms" }}>
                    View All Deals
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-slide-up.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
