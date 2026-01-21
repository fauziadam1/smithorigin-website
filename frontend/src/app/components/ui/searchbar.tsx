"use client"
import clsx from "clsx"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Product } from "@/lib/product"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  isHome: boolean
  navbarScrolled: boolean
  isMobile?: boolean
}

export default function SearchBar({ isHome, navbarScrolled, isMobile = false }: SearchBarProps) {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?search=${encodeURIComponent(searchQuery)}&limit=5`
        )
        const result = await response.json()

        if (result.data) {
          setSearchResults(result.data)
          setShowSearchResults(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleProductClick = (productId: number) => {
    router.push(`/user/product/${productId}`)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  const formatPrice = (price: number, discount?: number) => {
    const finalPrice = discount ? price - (price * discount / 100) : price
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(finalPrice)
  }

  return (
    <div ref={searchRef} className="relative">
      <form
        className={clsx(
          "flex items-center gap-2 rounded-full",
          isMobile 
            ? "py-2 px-3" 
            : "py-3 px-5",
          isHome && !navbarScrolled
            ? "border border-white/30 text-white"
            : "border border-gray-200 text-black"
        )}
      >
        <label htmlFor={isMobile ? "mobile-search" : "search"}>
          <Search
            className={clsx(
              "cursor-pointer shrink-0",
              isMobile ? "w-4 h-4" : "w-4 h-4",
              isHome && !navbarScrolled ? "text-white/60" : "text-gray-500"
            )}
          />
        </label>
        <input
          type="text"
          placeholder="Cari"
          id={isMobile ? "mobile-search" : "search"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
          className={clsx(
            "outline-none border-none bg-transparent",
            isMobile 
              ? "w-27 xs:w-24 sm:w-32 text-[12px]" 
              : "pr-5 w-50 text-[12px]",
            isHome && !navbarScrolled
              ? "text-white placeholder-white/70"
              : "text-black placeholder-gray-600"
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className={clsx(
              "hover:opacity-70 cursor-pointer transition-opacity shrink-0 ml-auto",
              isHome && !navbarScrolled ? "text-white" : "text-gray-500"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {showSearchResults && (
        <div className={clsx(
          "absolute top-full mt-2 bg-white rounded-xl border border-gray-200 z-50 overflow-y-auto shadow-lg",
          isMobile 
            ? "right-0 w-[280px] max-h-[400px]" 
            : "w-full min-w-[380px] max-h-[450px]"
        )}>
          {isSearching ? (
            <div className={clsx("text-center", isMobile ? "p-4" : "p-6")}>
              <div className={clsx(
                "animate-spin rounded-full border-b-2 border-red-800 mx-auto mb-2",
                isMobile ? "h-6 w-6" : "h-8 w-8"
              )}></div>
              <p className={clsx("text-gray-500", isMobile ? "text-xs" : "text-sm")}>
                Mencari Product...
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-1">
              {searchResults.map((product) => {
                const finalPrice =
                  product.discount && product.discount > 0
                    ? product.price - (product.price * product.discount / 100)
                    : product.price

                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className={clsx(
                      "hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                      isMobile ? "px-2.5 py-2" : "px-3 py-2"
                    )}
                  >
                    <div className={clsx("flex items-center", isMobile ? "gap-2" : "gap-3")}>
                      <div className={clsx(
                        "rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200",
                        isMobile ? "w-11 h-11" : "w-13 h-13"
                      )}>
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search className={clsx("text-gray-400", isMobile ? "w-5 h-5" : "w-6 h-6")} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          "font-semibold text-black line-clamp-2",
                          isMobile ? "text-[11px] mb-0.5 leading-tight" : "text-sm mb-1"
                        )}>
                          {product.name}
                        </p>

                        <div className={clsx("flex items-center flex-wrap", isMobile ? "gap-1" : "gap-2")}>
                          <p className={clsx(
                            "font-bold text-red-800 whitespace-nowrap",
                            isMobile ? "text-[11px]" : "text-sm"
                          )}>
                            {formatPrice(finalPrice)}
                          </p>
                          {product.discount && product.discount > 0 && (
                            <>
                              <p className={clsx(
                                "text-gray-400 line-through whitespace-nowrap",
                                isMobile ? "text-[9px]" : "text-xs"
                              )}>
                                {formatPrice(product.price)}
                              </p>
                              <span className={clsx(
                                "rounded bg-red-100 text-red-600 font-semibold whitespace-nowrap",
                                isMobile ? "text-[9px] px-1 py-0.5" : "text-xs px-1.5 py-0.5"
                              )}>
                                -{product.discount}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={clsx("text-center", isMobile ? "p-4" : "p-6")}>
              <div className={clsx(
                "bg-gray-100 rounded-full flex items-center justify-center mx-auto",
                isMobile ? "w-12 h-12 mb-2" : "w-16 h-16 mb-3"
              )}>
                <Search className={clsx("text-gray-400", isMobile ? "w-6 h-6" : "w-8 h-8")} />
              </div>
              <p className={clsx("text-gray-500 font-medium mb-1", isMobile ? "text-xs" : "text-sm")}>
 Nothing Found
              </p>
              <p className={clsx("text-gray-400", isMobile ? "text-[10px]" : "text-xs")}>
Try a different keyword
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}