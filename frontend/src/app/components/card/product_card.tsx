'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import api from '../../../../lib/axios'
import { getAuth } from '../../../../lib/auth'
import { Product } from '../../../../lib/product'
import { useAlert } from '../alert/alert_context'

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { showAlert } = useAlert()
  const { user } = getAuth()
  const [isFavorite, setIsFavorite] = useState(false)

  const hasDiscount = product.discount && product.discount > 0
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price

  useEffect(() => {
    if (!user) return

    const checkFavorite = async () => {
      try {
        const response = await api.get<{ data: { productId: number }[] }>('/favorites')
        const favorites = response.data.data
        const alreadyFavorite = favorites.some(fav => fav.productId === product.id)
        setIsFavorite(alreadyFavorite)
      } catch (error) {
        console.error('Gagal memeriksa favorit:', error)
      }
    }

    checkFavorite()
  }, [user, product.id])

  const toggleFavorite = async () => {
    if (!user) {
      showAlert('Silakan login untuk menambah ke wishlist')
      setTimeout(() => router.push('/auth/sign-in'), 3000)
      return
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${product.id}`)
        setIsFavorite(false)
      } else {
        await api.post('/favorites', { productId: product.id })
        setIsFavorite(true)
      }
    } catch (error: unknown) {
      console.error(error)
      const err = error as { response?: { data?: { message?: string } } }
      showAlert(err.response?.data?.message || 'Gagal mengubah wishlist')
    }
  }

  return (
    <div className="w-full max-w-[250px] relative">
      <Link href={`/user/product/${product.id}`}>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition group">
          <Image
            src={product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />

          {product.isBestSeller && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
              ⭐ Best
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
          <div className="flex items-baseline gap-2">
            <h1 className="font-semibold text-[19px] md:text-[14px]">
              Rp {discountedPrice.toLocaleString('id-ID')}
            </h1>
            {hasDiscount && (
              <h1 className="text-[14px] md:text-[11px] line-through text-[#a7a7a7]">
                Rp {product.price.toLocaleString('id-ID')}
              </h1>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={toggleFavorite}
        className="w-full bg-white border cursor-pointer border-gray-300 rounded-full py-2 mt-1 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
      >
        {isFavorite ? (
          <AiFillHeart className="w-4 h-4 text-red-500" />
        ) : (
          <AiOutlineHeart className="w-4 h-4" />
        )}
        <span className="text-sm">Wishlist</span>
      </button>
    </div>
  )
}
