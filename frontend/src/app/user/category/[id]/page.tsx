'use client'
import Link from 'next/link'
import Image from 'next/image'
import { isAxiosError } from 'axios'
import api from '../../../../lib/axios'
import { Product } from '@/lib/product'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlert } from '../../../components/ui/alert'
import { useAuth } from '@/app/components/ui/authcontext'
import { ProductCard } from '@/app/components/ui/productcard'
import FilterSidebar from '@/app/components/ui/filterCategory'
import { ChevronRight as Arrow, SlidersHorizontal, X } from 'lucide-react'

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

  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileFilter])

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
      <div className="container px-4 md:px-6 lg:px-10 py-24 md:py-32 lg:py-40 mx-auto animate-pulse">
        <div className="flex items-center gap-2 mb-4 md:mb-5 text-xs md:text-sm text-gray-400">
          <div className="h-3 md:h-4 w-10 md:w-12 bg-gray-200 rounded"></div>
          <Arrow className="w-3 md:w-4 h-3 md:h-4 text-gray-300" />
          <div className="h-3 md:h-4 w-20 md:w-24 bg-gray-200 rounded"></div>
        </div>

        <div className="flex gap-4 md:gap-6 lg:gap-8">
          <div className="w-56 md:w-64 shrink-0 hidden lg:block">
            <div className="h-80 md:h-96 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="relative w-full aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-3 md:h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-2 md:h-3 w-1/2 bg-gray-200 rounded"></div>
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-sm md:text-base">{error || 'Kategori tidak ditemukan'}</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm md:text-base">
            Kembali ke Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="container px-4 md:px-6 lg:px-10 py-24 md:py-32 lg:py-40 mx-auto min-h-screen">
        <div className="w-full flex items-center text-xs md:text-sm text-gray-600 mb-4 md:mb-6 lg:mb-8">
          <Link href="/" className="hover:text-red-800 cursor-pointer">Home</Link>
          <span className="mx-1 md:mx-2"><Arrow className='w-3 md:w-4 h-3 md:h-4' /></span>
          <span className="text-gray-900 truncate">{category.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-5 w-full sm:w-auto">
            {category.imageUrl && (
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">{category.name}</h1>
              <p className="text-gray-600 mt-0.5 md:mt-1 text-xs md:text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm md:text-base w-full sm:w-auto justify-center"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex gap-4 md:gap-6 lg:gap-8">
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

          <AnimatePresence>
            {showMobileFilter && (
              <div className="fixed inset-0 z-5000 lg:hidden">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/50" 
                  onClick={() => setShowMobileFilter(false)}
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 35, stiffness: 300 }}
                  className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white overflow-y-auto"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h2 className="text-base md:text-lg font-bold">Filters</h2>
                      <button 
                        onClick={() => setShowMobileFilter(false)}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                      >
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
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 md:py-16 lg:py-20">
                <p className="text-gray-500 text-base md:text-lg mb-2">Tidak ada product</p>
                <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">Coba sesuaikan filter Anda</p>
                <button
                  onClick={resetFilters}
                  className="text-red-800 font-medium hover:underline text-sm md:text-base"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
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

function CardProduct({
  product
}: {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <div className="w-full relative group">
      <ProductCard key={product.id} product={product} />
    </div>
  )
}