'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import api from '../../lib/axios'

interface Category {
  id: number
  name: string
  imageUrl: string | null
  _count?: {
    products: number
  }
}

export function ButtonCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data)
    } catch (err: any) {
      console.error('Error fetching categories:', err)
      setError('Gagal memuat kategori')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-10">
        <h1 className="text-center text-2xl font-[700]">Category</h1>
        <p className="text-center text-gray-500">Loading categories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-10">
        <h1 className="text-center text-2xl font-[700]">Category</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="w-full flex flex-col gap-10">
        <h1 className="text-center text-2xl font-[700]">Category</h1>
        <p className="text-center text-gray-500">Belum ada kategori</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-10">
      <h1 className="text-center text-2xl font-[700]">Category</h1>
      <section className="flex justify-center items-center gap-10 flex-wrap">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/user/category/${cat.id}`}
            className="flex flex-col text-center gap-3 w-fit h-fit group"
          >
            <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden border border-gray-200 group-hover:border-gray-300 transition">
              <Image
                src={cat.imageUrl || '/placeholder.jpg'}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div>
              <h2 className="font-[600] text-gray-900 group-hover:text-blue-600 transition">
                {cat.name}
              </h2>
              {cat._count && (
                <p className="text-xs text-gray-500">
                  {cat._count.products} products
                </p>
              )}
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}