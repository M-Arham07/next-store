"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput({
    PRODUCTS,
    placeholders = [
        "Search products",
        "Search phones",
        "Search laptops",
        "Search headphones",
        "Search smartwatches",
        "Search tablets",
        "Search accessories",
        "Search monitors",
        "Search speakers",
        "Search cameras",
    ],
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const [isTyping, setIsTyping] = useState(true)
    const [value, setValue] = useState("") // Declare value here

    
      const router=useRouter();
    

    useEffect(() => {
        setMounted(true);
        setIsExpanded(true);
        
   
    }, []);





    useEffect(() => {
        if (!mounted || value) return

        const currentPlaceholder = placeholders[currentPlaceholderIndex]
        let timeoutId

        if (isTyping) {
            // Typing effect
            if (displayedText.length < currentPlaceholder.length) {
                timeoutId = setTimeout(() => {
                    setDisplayedText(currentPlaceholder.slice(0, displayedText.length + 1))
                }, 50) // Typing speed
            } else {
                // Finished typing, wait then start deleting
                timeoutId = setTimeout(() => {
                    setIsTyping(false)
                }, 2000) // Pause before deleting
            }
        } else {
            // Deleting effect
            if (displayedText.length > 0) {
                timeoutId = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1))
                }, 30) // Deleting speed (faster than typing)
            } else {
                // Finished deleting, move to next placeholder
                setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
                setIsTyping(true)
            }
        }

        return () => clearTimeout(timeoutId)
    }, [mounted, displayedText, isTyping, currentPlaceholderIndex, placeholders, value]);

    

    // Reset typewriter when user starts typing
    useEffect(() => {
        if (value) {
            setDisplayedText("")
            setIsTyping(true)
        }
    }, [value])

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Debounced search function
    const debouncedSearch = useRef(
        debounce((searchValue) => {
            router.push(searchValue.trim() 
                ? `/products?name=${encodeURIComponent(searchValue.trim())}` 
                : '/products'
            );
        }, 500) // 500ms delay
    ).current;

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    };




    return (
        <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
            <div
                className={cn(
                    "relative mx-auto bg-white dark:bg-zinc-800 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-300 ease-in-out",
                    mounted && isExpanded ? "w-full max-w-xl h-12" : "w-12 h-12",
                    value && "bg-gray-50",
                )}
            >
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400 dark:text-gray-500"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>

                <input
                    onChange={handleChange}
                    value={value}
                    type="search"
                    className={cn(
                        "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 transition-all duration-300 pl-12 pr-12 opacity-100",
                    )}
                />

                <button
                    onClick={() => {
                        if (value.trim()) {
                            router.push(`/products?name=${encodeURIComponent(value)}`);
                        } else {
                            router.push('/products');
                        }
                    }}
                    type="button"
                    className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full bg-black hover:bg-gray-800 dark:bg-zinc-900 transition-all duration-300 flex items-center justify-center opacity-100 scale-100" 
                    value={value}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300 h-4 w-4"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12l14 0" />
                        <path d="M13 18l6 -6" />
                        <path d="M13 6l6 6" />
                    </svg>
                </button>

                <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
                    {!value && (
                        <p className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-12 pr-12 text-left w-full truncate">
                            {displayedText}
                            <span className="animate-pulse">|</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}






