'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'
import api from '../../../../lib/axios'
import { getAuth } from '../../../../lib/auth'

interface FavoriteProduct {
  id: number
  userId: number
  productId: number
  product: {
    id: number
    name: string
    price: number
    discount: number | null
    imageUrl: string | null
    category: {
      id: number
      name: string
    } | null
  }
}

export default function FavoritesPage() {
  const router = useRouter()
  const { user } = getAuth()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in')
      return
    }
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/favorites')
      setFavorites(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (productId: number) => {
    if (!confirm('Hapus produk dari wishlist?')) return

    try {
      await api.delete(`/favorites/${productId}`)
      setFavorites(prev => prev.filter(fav => fav.productId !== productId))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus dari wishlist')
    }
  }

  const calculateFinalPrice = (price: number, discount: number | null) => {
    if (!discount) return price
    return price - (price * discount / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-40">
      <div className="container mx-auto px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AiFillHeart className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          <Link href="/user" className="text-sm text-gray-600 hover:text-gray-900 transition">
            ← Back to Home
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AiFillHeart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding your favorite products to keep track of them!
            </p>
            <Link
              href="/user"
              className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const product = favorite.product
              const finalPrice = calculateFinalPrice(product.price, product.discount)
              const hasDiscount = product.discount && product.discount > 0

              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition group"
                >
                  <Link href={`/user/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <Image
                        src={product.imageUrl || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                      {hasDiscount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/user/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-500 transition">
                        {product.name}
                      </h3>
                    </Link>

                    {product.category && (
                      <p className="text-xs text-gray-500 mb-3">
                        {product.category.name}
                      </p>
                    )}

                    <div className="flex items-baseline gap-2 mb-4">
                      {hasDiscount ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            Rp {finalPrice.toLocaleString('id-ID')}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 border border-red-300 text-red-500 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                      >
                        <BiTrash className="w-4 h-4" />
                        Remove
                      </button>
                      <Link
                        href={`/user/product/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                      >
                        <AiOutlineShoppingCart className="w-4 h-4" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}