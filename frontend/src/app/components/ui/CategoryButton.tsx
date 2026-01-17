'use client'
import 'swiper/css'
import Link from 'next/link'
import 'swiper/css/scrollbar'
import 'swiper/css/free-mode'
import Image from 'next/image'
import { AxiosError } from 'axios'
import api from '../../../lib/axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar, FreeMode } from 'swiper/modules'
import React, { useState, useEffect, useRef } from 'react'

interface Category {
  id: number
  name: string
  imageUrl: string | null
}

export function ButtonCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [useSlider, setUseSlider] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length === 0) return

    const checkIfNeedSlider = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const isMobile = window.innerWidth < 768
      const itemWidth = isMobile ? 140 : 180
      const gap = isMobile ? 12 : 40
      
      const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap))
      
      setUseSlider(categories.length > itemsPerRow)
    }

    checkIfNeedSlider()
    window.addEventListener('resize', checkIfNeedSlider)
    
    return () => window.removeEventListener('resize', checkIfNeedSlider)
  }, [categories])

  const fetchCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/categories')
      setCategories(res.data.data)
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>
      setError(err.response?.data?.message || 'Gagal memuat kategori')
    } finally {
      setLoading(false)
    }
  }

  const calculateDragSize = () => {
    const baseSize = 120
    const reduction = categories.length * 6
    return Math.max(30, Math.min(100, baseSize - reduction))
  }

  if (loading || error || categories.length === 0) {
    return (
      <div className="w-full flex flex-col gap-10">
        <h1 className="text-center text-2xl font-bold">Category</h1>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 md:gap-10">
      <h1 className="text-center text-xl md:text-2xl font-bold px-4">Category</h1>

      <div ref={containerRef} className="w-full px-4.5">
        {useSlider ? (
          <div className="-mx-4">
            <Swiper
              modules={[Scrollbar, FreeMode]}
              spaceBetween={10}
              slidesPerView="auto"
              freeMode={{
                enabled: true,
                momentum: true,
                momentumRatio: 0.5,
              }}
              scrollbar={{
                draggable: true,
                dragSize: calculateDragSize(),
                hide: false,
              }}
              breakpoints={{
                768: {
                  spaceBetween: 35,
                },
              }}
              className="category-swiper pb-9!"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} className="w-[140px]! md:w-[180px]!">
                  <Link
                    href={`/user/category/${cat.id}`}
                    className="flex flex-col gap-2.5 md:gap-3 group active:scale-95 transition-transform"
                  >
                    <div className="relative w-full aspect-square rounded-md md:rounded-lg overflow-hidden">
                      <Image
                        src={cat.imageUrl || '/placeholder.jpg'}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 140px, 180px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                    <h2 className="text-sm md:text-base font-semibold text-center text-gray-800 leading-tight px-1 line-clamp-2">
                      {cat.name}
                    </h2>
                  </Link>
                </SwiperSlide>
              ))}
              <SwiperSlide className="w-1!" />
            </Swiper>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 md:gap-10 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/user/category/${cat.id}`}
                className="flex flex-col gap-2.5 md:gap-3 w-[140px] md:w-[180px] group transition-transform"
              >
                <div className="relative w-full aspect-square rounded-md md:rounded-lg overflow-hidden md:border md:border-gray-200">
                  <Image
                    src={cat.imageUrl || '/placeholder.jpg'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 140px, 180px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-sm md:text-base font-semibold text-center text-gray-800 leading-tight px-1 line-clamp-2">
                  {cat.name}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}