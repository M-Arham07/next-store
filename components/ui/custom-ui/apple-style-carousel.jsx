"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function AppleStyleCarousel ({
  images = [],
  autoplayInterval = 4000,
  className = "",
  showProgress = true,
  showDots = true,
  animationDelay = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const carouselRef = useRef(null)

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => {
              setIsVisible(true)
              setHasAnimated(true)
            }, animationDelay)
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: "0px 0px -50px 0px",
      },
    )

    if (carouselRef.current) {
      observer.observe(carouselRef.current)
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current)
      }
    }
  }, [animationDelay, hasAnimated])

  // Autoplay functionality
  useEffect(() => {
    if (!isHovered && images.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [isHovered, images.length, autoplayInterval, isVisible])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-3xl dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No images to display</p>
      </div>
    )
  }

  return (
    <div
      ref={carouselRef}
      className={`relative w-full group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main carousel container with scroll animation */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-2 md:p-6 shadow-xl transition-all duration-1000 ease-out dark:border-neutral-700 dark:bg-neutral-900 ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}
      >
        {/* Image container */}
        <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden rounded-2xl bg-black">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                />
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Title overlay */}
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-2 transition-all duration-700 delay-300 ${
                      index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {image.title}
                  </h3>
                  {image.subtitle && (
                    <p
                      className={`text-lg md:text-xl text-white/80 transition-all duration-700 delay-500 ${
                        index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      {image.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dots indicator */}
      {showDots && images.length > 1 && (
        <div
          className={`flex justify-center mt-8 space-x-3 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-black dark:bg-white"
                  : "w-2 bg-gray-400 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {showProgress && images.length > 1 && (
        <div
          className={`mt-6 h-1 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 transition-all duration-700 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div
            className="h-full bg-black dark:bg-white transition-all ease-linear rounded-full"
            style={{
              width: isHovered ? "0%" : `${((currentIndex + 1) / images.length) * 100}%`,
              transition: isHovered ? "width 0.3s ease" : `width ${autoplayInterval}ms linear`,
            }}
          />
        </div>
      )}

      {/* Slide counter */}
      <div
        className={`flex justify-center mt-4 text-sm text-gray-500 dark:text-gray-400 transition-all duration-700 delay-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {currentIndex + 1} of {images.length}
      </div>
    </div>
  )
}


