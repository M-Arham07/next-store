"use client"

import { motion } from "motion/react"
import AppleStyleCarousel from "@/components/ui/custom-ui/apple-style-carousel"
// DEFAULT PROPS:
export default function HeroSection({
   images=[
              {
                src: "/s24u.jpg",
                title: "Samsung S24 Ultra",
                subtitle: "Next-level AI photography with 200MP camera",
              },
              {
                src: "https://oasis.opstatics.com/content/dam/oasis/page/2024/12/homepage/sill/12-pc-slider.jpg",
                title: "OnePlus 12",
                subtitle: "Hasselblad imaging with 4th Gen SuperVOOC",
              },
              {
                src: "https://images.samsung.com/is/image/samsung/assets/in/2307/pcd/PCD_DM3_KV_Carousel_684x684_pc.jpg",
                title: "Galaxy Z Fold 5",
                subtitle: "Unfold new possibilities with flex mode",
              },
              {
                src: "https://oasis.opstatics.com/content/dam/oasis/page/2023/operation/1218/watch2/img/img-watch2-product-pc.jpg",
                title: "OnePlus Watch 2",
                subtitle: "Smart Living with 100+ Hours Battery Life",
              },
              {
                src: "https://images.samsung.com/is/image/samsung/assets/in/tablets/galaxy-tab-s9-ultra/buy/tab-s9-ultra-highlights-intelligent-pc-experience.jpg",
                title: "Galaxy Tab S9 Ultra",
                subtitle: "PC-like multitasking with S Pen included",
              },
            ],
            autoplayInterval=2000,
            animationDelay=200
}) {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      {/* <TopBar /> */}
      <div className="absolute inset-y-0 left-0 h-full w-px hidden md:block bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px hidden md:block bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full hidden md:block bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-2 sm:px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Elevate Your Tech Experience".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block text-black dark:text-white"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Experience the future of technology with our curated collection of premium gadgets and devices. From the latest smartphones 
          to cutting-edge accessories, we bring innovation to your fingertips.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Explore Products
          </button>
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20"
        >
          <AppleStyleCarousel
            images={images}
            autoplayInterval={autoplayInterval}
            animationDelay={animationDelay}
            showProgress={true}
            showDots={true}
            className="w-full"
          />
        </motion.div>
      </div>
    </div>
  )
}

// const TopBar = () => {
//   return (
//     <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
//       <div className="flex items-center gap-2">
//         <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
//         <h1 className="text-base font-bold md:text-2xl">Aceternity UI</h1>
//       </div>
//       <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
//         Login
//       </button>
//     </nav>
//   )
// }
