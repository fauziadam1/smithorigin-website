'use client'
import Image from 'next/image'
import api from '../../../lib/axios'
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: number
  imageUrl: string
}

export default function Carousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/banners')
        setBanners(res.data.data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners])

  const nextSlide = () => {
    if (banners.length < 2) return
    setIndex((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    if (banners.length < 2) return
    setIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="w-full flex flex-col gap-6 relative">
      <h1 className="text-center font-bold text-2xl">What&apos;s New?</h1>

      {loading && (
        <div className="relative w-full max-w-[1440px] mx-auto aspect-2/1 bg-gray-200 rounded-lg animate-pulse" />
      )}

      {!loading && banners.length === 0 && (
        <div className="text-center py-8 text-gray-500">Tidak ada banner</div>
      )}

      {!loading && banners.length > 0 && (
        <div className="relative w-full max-w-[1500px] mx-auto aspect-2/1 overflow-hidden rounded-lg select-none">

          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="relative min-w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt="banner"
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute cursor-pointer top-1/2 left-3 -translate-y-1/2 z-20 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronLeft className="w-8 h-8 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2 z-20 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white"
          >
            <ChevronRight className="w-8 h-8 text-gray-700" />
          </button>

          <div className="absolute bottom-0 left-0 p-5 flex gap-2">
            {banners.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-6 h-1.5 cursor-pointer rounded ${
                  index === i ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

