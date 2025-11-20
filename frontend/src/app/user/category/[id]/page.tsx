'use client'
import Link from 'next/link'
import Image from 'next/image'
import api from '../../../../lib/axios'
import { useState, useEffect } from 'react'
import { getAuth } from '../../../../lib/auth'
import { ChevronRight as Arrow } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useAlert } from '../../../components/ui/alert_context'
import { isAxiosError } from 'axios'

interface Product {
  id: number
  name: string
  price: number
  discount: number | null
  imageUrl: string | null
  categoryId: number
  isBestSeller: boolean
}

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

export default function CategoryPage() {
  const { showAlert } = useAlert()
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id
  const { user } = getAuth()

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (categoryId) {
      void fetchCategoryAndProducts()
      if (user) void fetchFavorites()
    }
  }, [categoryId])

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

  const toggleFavorite = async (productId: number) => {
    if (!user) {
      showAlert('Silakan login untuk menambah ke wishlist')
      setTimeout(() => router.push('/auth/sign-in'), 3000)
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

        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-8 w-full bg-gray-200 rounded-full mt-1"></div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
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
      <section className="container px-10 py-40 mx-auto h-fit flex items-start justify-center">
        <div className="w-full flex flex-col gap-10">
          <div className="w-full flex item-center text-sm text-gray-600">
            <Link href="/" className="hover:text-red-800 cursor-pointer">Home</Link>
            <span className="mx-2"><Arrow className='w-4 h-4 translate-y-0.5' /></span>
            <span className="text-gray-900">{category.name}</span>
          </div>

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
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Belum ada produk di kategori ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map(product => (
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
      </section>
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
      <Link href={`/user/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition">
          <div className="relative w-full aspect-square">
            <Image
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          {product.isBestSeller && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
              ⭐ Best Seller
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="py-3 space-y-1">
          <p className="text-[15px] truncate">{product.name}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="font-semibold text-[19px] md:text-[16px] text-gray-900">
              Rp {discountedPrice.toLocaleString('id-ID')}
            </h1>
            {hasDiscount && (
              <h1 className="text-[14px] md:text-[12px] line-through text-gray-400">
                Rp {product.price.toLocaleString('id-ID')}
              </h1>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={e => {
          e.preventDefault()
          onToggleFavorite()
        }}
        className="w-full bg-white border cursor-pointer border-gray-300 rounded-full py-2 mt-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm font-medium"
      >
        {isFavorite ? (
          <AiFillHeart className="w-4 h-4 text-red-500" />
        ) : (
          <AiOutlineHeart className="w-4 h-4" />
        )}
        Wishlist
      </button>
    </div>
  )
}
