'use client'
import Link from 'next/link'
import Image from 'next/image'
import { isAxiosError } from 'axios'
import api from '../../../../lib/axios'
import { Product } from '@/lib/product'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAlert } from '../../../components/ui/alert'
import { useAuth } from '@/app/components/ui/authcontext'
import { ProductCard } from '@/app/components/ui/productcard'
import { ChevronRight as Arrow, SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';

interface Category {
  id: number
  name: string
  imageUrl: string | null
  _count: {
    products: number
  }
}

interface FavoriteResponse {
  data: {
    data: { productId: number }[]
  }
}

type SortOption = 'newest' | 'lowest-price' | 'highest-price' | 'name-asc' | 'name-desc'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'lowest-price', label: 'Lowest Price' },
  { value: 'highest-price', label: 'Highest Price' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
] as const

export default function CategoryPage() {
  const { showAlert } = useAlert()
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id
  const { user } = useAuth()

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 10000000])
  const [showBestSeller, setShowBestSeller] = useState(false)
  const [showDiscount, setShowDiscount] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  useEffect(() => {
    if (categoryId) {
      void fetchCategoryAndProducts()
      if (user) void fetchFavorites()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, priceRange, showBestSeller, showDiscount, sortBy])

  const fetchCategoryAndProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const categoryRes = await api.get<{ data: Category }>(`/categories/${categoryId}`)
      setCategory(categoryRes.data.data)

      const productsRes = await api.get<{ data: Product[] }>(
        `/products?categoryId=${categoryId}&limit=100`
      )
      setProducts(productsRes.data.data)

      const maxPrice = Math.max(...productsRes.data.data.map(p => p.price), 10000000)
      setPriceRange([0, maxPrice])
      setTempPriceRange([0, maxPrice])
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Gagal memuat data')
      } else {
        setError('Terjadi kesalahan tidak terduga')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await api.get<FavoriteResponse['data']>('/favorites')
      const favoriteIds = response.data.data.map(fav => fav.productId)
      setFavorites(new Set(favoriteIds))
    } catch (err) {
      console.error('Error fetching favorites:', err)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    filtered = filtered.filter(p => {
      const finalPrice = p.discount
        ? p.price * (1 - p.discount / 100)
        : p.price
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1]
    })

    if (showBestSeller) {
      filtered = filtered.filter(p => p.isBestSeller)
    }

    if (showDiscount) {
      filtered = filtered.filter(p => p.discount && p.discount > 0)
    }

    switch (sortBy) {
      case 'lowest-price':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return priceA - priceB
        })
        break
      case 'highest-price':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return priceB - priceA
        })
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const resetFilters = () => {
    const maxPrice = Math.max(...products.map(p => p.price), 10000000)
    setPriceRange([0, maxPrice])
    setTempPriceRange([0, maxPrice])
    setShowBestSeller(false)
    setShowDiscount(false)
    setSortBy('newest')
  }

  const toggleFavorite = async (productId: number) => {
    if (!user) {
      showAlert('Silakan login untuk menambah ke wishlist')
      setTimeout(() => router.push('/auth/login'), 3000)
      return
    }

    try {
      if (favorites.has(productId)) {
        await api.delete(`/favorites/${productId}`)
        setFavorites(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      } else {
        await api.post('/favorites', { productId })
        setFavorites(prev => new Set([...prev, productId]))
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        showAlert(err.response?.data?.message || 'Gagal mengubah wishlist')
      } else {
        showAlert('Kesalahan tidak terduga')
      }
    }
  }

  if (loading) {
    return (
      <div className="container px-10 py-40 mx-auto animate-pulse">
        <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
          <Arrow className="w-4 h-4 text-gray-300" />
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        <div className="flex gap-8">
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="relative w-full aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Kategori tidak ditemukan'}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Kembali ke Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="container px-10 py-40 mx-auto min-h-screen">
        <div className="w-full flex items-center text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-red-800 cursor-pointer">Home</Link>
          <span className="mx-2"><Arrow className='w-4 h-4' /></span>
          <span className="text-gray-900">{category.name}</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            {category.imageUrl && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex gap-8">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            tempPriceRange={tempPriceRange}
            setTempPriceRange={setTempPriceRange}
            showBestSeller={showBestSeller}
            setShowBestSeller={setShowBestSeller}
            showDiscount={showDiscount}
            setShowDiscount={setShowDiscount}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resetFilters={resetFilters}
            maxPrice={Math.max(...products.map(p => p.price), 10000000)}
            className="hidden lg:block"
          />

          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)}></div>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={() => setShowMobileFilter(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterSidebar
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    tempPriceRange={tempPriceRange}
                    setTempPriceRange={setTempPriceRange}
                    showBestSeller={showBestSeller}
                    setShowBestSeller={setShowBestSeller}
                    showDiscount={showDiscount}
                    setShowDiscount={setShowDiscount}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    resetFilters={resetFilters}
                    maxPrice={Math.max(...products.map(p => p.price), 10000000)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="text-red-800 font-medium hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <CardProduct
                    key={product.id}
                    product={product}
                    isFavorite={favorites.has(product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function CustomDropdown({
  value,
  onChange,
  options,
}: {
  value: SortOption
  onChange: (value: SortOption) => void
  options: readonly { value: SortOption; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
      >
        <span className="text-gray-900">{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition flex items-center justify-between ${value === option.value ? 'bg-red-50 text-red-800' : 'text-gray-700'
                }`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterSidebar({
  setPriceRange,
  tempPriceRange,
  setTempPriceRange,
  showBestSeller,
  setShowBestSeller,
  showDiscount,
  setShowDiscount,
  sortBy,
  setSortBy,
  resetFilters,
  maxPrice,
  className = ''
}: {
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  tempPriceRange: [number, number]
  setTempPriceRange: (range: [number, number]) => void
  showBestSeller: boolean
  setShowBestSeller: (val: boolean) => void
  showDiscount: boolean
  setShowDiscount: (val: boolean) => void
  sortBy: SortOption
  setSortBy: (val: SortOption) => void
  resetFilters: () => void
  maxPrice: number
  className?: string
}) {
  return (
    <div className={`w-64 shrink-0 ${className}`}>
      <div className="sticky top-32 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm text-red-800 hover:underline font-medium"
          >
            Reset
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Sort By</h3>
          <CustomDropdown
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <input
                type="number"
                value={tempPriceRange[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value)
                  setTempPriceRange([newMin, tempPriceRange[1]])
                }}
                onBlur={() => {
                  setPriceRange(tempPriceRange)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Min"
                min="0"
                max={maxPrice}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={tempPriceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value)
                  setTempPriceRange([tempPriceRange[0], newMax])
                }}
                onBlur={() => {
                  setPriceRange(tempPriceRange)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Max"
                min="0"
                max={maxPrice}
              />
            </div>

            <div className="relative pt-2 pb-4">
              <div className="relative h-1 bg-gray-200 rounded">
                <div
                  className="absolute h-1 bg-red-800 rounded"
                  style={{
                    left: `${(tempPriceRange[0] / maxPrice) * 100}%`,
                    right: `${100 - (tempPriceRange[1] / maxPrice) * 100}%`
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={tempPriceRange[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value)
                  if (newMin <= tempPriceRange[1]) {
                    setTempPriceRange([newMin, tempPriceRange[1]])
                    setPriceRange([newMin, tempPriceRange[1]])
                  }
                }}
                className="absolute w-full h-1 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={tempPriceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value)
                  if (newMax >= tempPriceRange[0]) {
                    setTempPriceRange([tempPriceRange[0], newMax])
                    setPriceRange([tempPriceRange[0], newMax])
                  }
                }}
                className="absolute w-full h-1 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Rp {tempPriceRange[0].toLocaleString('id-ID')}</span>
              <span>Rp {tempPriceRange[1].toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Quick Filters</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showBestSeller}
                onChange={(e) => setShowBestSeller(e.target.checked)}
                className="w-4 h-4 accent-red-800 cursor-pointer"
              />
              <span className="text-sm group-hover:text-red-800 transition">
                ⭐ Best Seller Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showDiscount}
                onChange={(e) => setShowDiscount(e.target.checked)}
                className="w-4 h-4 accent-red-800 cursor-pointer"
              />
              <span className="text-sm group-hover:text-red-800 transition">
                🏷️ Discounted Only
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardProduct({
  product,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  const hasDiscount = product.discount && product.discount > 0
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount ?? 0) / 100)
    : product.price

  return (
    <div className="w-full relative group">
      <ProductCard key={product.id} product={product} />
    </div>
  )
}