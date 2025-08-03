"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "radix-ui"

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date)
}

export default function ProductDetailsModal({ product, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  if (!product) return null

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
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
      navigateImage("next")
    } else if (isRightSwipe) {
      navigateImage("prev")
    }
  }

  const navigateImage = (direction) => {
    if (direction === "prev") {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
    } else {
      setCurrentImageIndex(Math.min((product.images?.length || 1) - 1, currentImageIndex + 1))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} key={product._id}>
      <DialogContent className="max-w-4xl max-h-[75vh] sm:max-h-[80vh] md:max-h-[85vh] lg:max-h-[90vh] overflow-y-auto pt-14">
    
        <DialogTitle className="hidden">Product Information</DialogTitle>
        
        <div className="fixed top-0 right-0 left-0 h-14 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-end px-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Product Images */}
        <div className="mt-2 space-y-4">
          {/* Main Image */}
          <div
            className="relative aspect-square max-w-2xl mx-auto bg-muted rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={product.images?.[currentImageIndex] || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
            {/* Navigation Buttons */}
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
              disabled={currentImageIndex === (product.images?.length || 1) - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center">
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {product.images?.map((thumb, index) => (
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

        {/* Product Details */}
        <div className="space-y-4">
          {/* Pricing */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.oldPrice}</span>
            )}
            {product.oldPrice && (
              <Badge className="bg-green-500">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Availability and Rating */}
          <div className="flex items-center space-x-4">
            <Badge variant={product.isAvailable ? "default" : "destructive"}>
              {product.isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <span className="text-sm">
              Stock: {product.availableUnits} {product.availableUnits === 1 ? "unit" : "units"}
            </span>
            <span className="text-sm">Rating: {product.rating}/5</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
          </div>

          {/* Category */}
          <div>
            <span className="font-semibold">Category: </span>
            <span className="text-muted-foreground">{product.category}</span>
          </div>

          {/* Timestamps */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Created: {formatDate(product.createdAt)}</p>
            <p>Last Updated: {formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
