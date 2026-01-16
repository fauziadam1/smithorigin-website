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
          "text-[12px] flex items-center gap-2 rounded-full",
          isMobile 
            ? "py-2 px-3 gap-2" 
            : "py-3 px-5 gap-3",
          isHome && !navbarScrolled
            ? "border border-white/30 text-white"
            : "border border-gray-200 text-black"
        )}
      >
        <label htmlFor={isMobile ? "mobile-search" : "search"}>
          <Search
            className={clsx(
              "w-4 h-4 cursor-pointer shrink-0",
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
              ? "w-27 xs:w-24 sm:w-32" 
              : "pr-5 w-50",
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
              "hover:opacity-70 cursor-pointer transition-opacity shrink-0",
              !isMobile && "absolute right-5",
              isHome && !navbarScrolled ? "text-white" : "text-gray-500"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {showSearchResults && (
        <div className={clsx(
          "absolute top-full mt-2 bg-white rounded-xl border border-gray-200 z-50 max-h-[450px] overflow-y-auto shadow-lg",
          isMobile 
            ? "right-0 w-[85vw] sm:w-[380px]" 
            : "w-full min-w-[380px]"
        )}>
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Mencari Product...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
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
                      "hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0",
                      isMobile ? "px-3 py-3" : "px-3 py-2"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200",
                        isMobile ? "w-14 h-14 sm:w-16 sm:h-16" : "w-13 h-13"
                      )}>
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={1200}
                            height={1200}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          "font-semibold text-sm text-black mb-1",
                          isMobile ? "line-clamp-2" : "truncate"
                        )}>
                          {product.name}
                        </p>

                        <div className={clsx(
                          "flex items-center gap-2",
                          isMobile && "flex-wrap"
                        )}>
                          <p className="font-bold text-sm text-red-800">
                            {formatPrice(finalPrice)}
                          </p>
                          {product.discount && product.discount > 0 && (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(product.price)}
                              </p>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold">
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
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Maaf yang kamu cari tidak ada
              </p>
              <p className="text-gray-400 text-xs">
                Coba pakai kata kunci lain untuk mencari
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}