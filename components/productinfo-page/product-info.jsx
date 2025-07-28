"use client"
import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, Bookmark, Share2, Star, ShoppingBag, Truck, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import SearchInput from "@/components/homepage/search-input"
import { useRouter } from "next/navigation";

export default function ProductInfoPage({currentProduct,addToCart}) {

  const {id,title:name,isAvailable,rating,price,oldPrice,category,images:thumbnails,description}=currentProduct ?? {};


  console.log("Curr product:",currentProduct)
 


  const [selectedColor, setSelectedColor] = useState("beige");
  const [selectedSize, setSelectedSize] = useState("small");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left - next image
      navigateImage("next")
    } else if (isRightSwipe) {
      // Swipe right - previous image
      navigateImage("prev")
    }
  }

  // Keep original product colors
  const colors = [
    { name: "beige", color: "#ecdecc", selected: true },
    { name: "green", color: "#bbd278" },
    { name: "blue", color: "#bbc1f8" },
    { name: "pink", color: "#ffd3f8" },
    { name: "coral", color: "#ee6a5f" },
  ]


 

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const navigateImage = (direction) => {
    if (direction === "prev") {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
    } else {
      setCurrentImageIndex(Math.min(thumbnails.length - 1, currentImageIndex + 1))
    }
  }

  const router=useRouter();
  return (
    
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-200 focus:bg-gray-200  rounded dark:hover:bg-gray-800 focus:dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-6">
        {/* Images Section */}
        <div className="order-1 lg:order-1">
          {/* Desktop Layout - Vertically Centered Thumbnails */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {/* Thumbnail Navigation - Vertically Centered */}
            <div className="flex flex-col space-y-2">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all duration-200 ${
                    index === currentImageIndex
                      ? "border-primary shadow-md scale-105"
                      : "border-border hover:border-muted-foreground hover:scale-102"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                  {index === currentImageIndex && <div className="absolute inset-0 bg-primary/10" />}
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div
              className="relative aspect-square flex-1 bg-muted rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={thumbnails[currentImageIndex] || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* PC-Only Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-lg w-10 h-10 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("prev")
                }}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-lg w-10 h-10 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("next")
                }}
                disabled={currentImageIndex === thumbnails.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Layout - Original Structure */}
          <div className="lg:hidden space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-muted rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={thumbnails[currentImageIndex] || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnail Navigation */}
            <div className="flex items-center">
              <div className="flex space-x-2 overflow-x-auto pb-1 w-full justify-center">
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all duration-200 ${
                      index === currentImageIndex
                        ? "border-primary shadow-md scale-105"
                        : "border-border hover:border-muted-foreground hover:scale-102"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={thumb || "/placeholder.svg"}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {index === currentImageIndex && <div className="absolute inset-0 bg-primary/10" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4 lg:space-y-5 order-2 lg:order-2">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{name}</h1>
              <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full shrink-0">{category}</span>
            </div>
            <div 
              className="cursor-pointer group w-full relative"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              <div className={`relative ${!isDescriptionExpanded ? 'h-[40px] sm:h-[48px]' : ''} transition-all duration-300 ease-in-out overflow-hidden`}>
                <p className="text-sm text-muted-foreground">
                  {description || "No description available for this product."}
                </p>
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
                )}
              </div>
              <span className="text-xs font-medium text-primary mt-1 inline-block group-hover:underline transition-transform duration-200 ease-in-out">
                {isDescriptionExpanded ? 'Show less' : 'Read more'}
              </span>
            </div>
          </div>

          {/* Price and Rating - Moved above hearts/bookmark/share */}
          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-semibold text-foreground">{price}</span>
              <span className="text-muted-foreground line-through">{oldPrice}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const diff = rating - (star - 1);
                    const fill = Math.max(0, Math.min(1, diff)) * 100;
                    return (
                      <div key={star} className="relative">
                        <Star
                          className="w-4 h-4 text-gray-300 dark:text-gray-600"
                        />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                          <Star
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm font-medium">{rating?.toFixed(1)}</span>
              </div>
              <span className="text-sm text-foreground underline cursor-pointer hover:no-underline">67 Reviews</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-green-600 dark:text-green-400">93%</span> of buyers have recommended
              this
            </p>
          </div>

          {/* Hearts, Bookmark, and Share Section */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm ml-1">109</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Color Selection */}
          {/*<div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Choose a Color</h3>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  } relative`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setSelectedColor(color.name)}
                >
                  {selectedColor === color.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>*/}

          {/* Size Selection */}
          {/*<div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Choose a Size</h3>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="grid grid-cols-2 sm:flex sm:space-x-6 gap-3 sm:gap-0"
            >
              {["Small", "Medium", "Large", "Extra Large", "XXL"].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={size.toLowerCase().replace(" ", "")}
                    id={size.toLowerCase().replace(" ", "")}
                    className="border-muted-foreground text-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                  />
                  <Label
                    htmlFor={size.toLowerCase().replace(" ", "")}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>*/}

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center border border-border rounded-lg w-fit bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="px-4 py-2 text-foreground font-medium min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={incrementQuantity}
              >
                +
              </Button>
            </div>
            <Button 
            onClick={()=>{}}
            className="flex-1 bg-foreground hover:bg-foreground/90 text-background h-12 rounded-lg font-medium cursor-pointer">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add To Cart
            </Button>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-muted rounded-lg">
                <Truck className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Free Delivery</h4>
                <p className="text-sm text-muted-foreground">Enter your Postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-muted rounded-lg">
                <RotateCcw className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Return Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Free 30 days Delivery Return.{" "}
                  <span className="underline cursor-pointer hover:text-foreground transition-colors">Details</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
