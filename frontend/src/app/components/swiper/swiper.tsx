'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import { Swiper as SwiperType } from 'swiper/types'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../../../lib/axios'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Banner {
  id: number
  imageUrl: string
}

export default function Carousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners')
      setBanners(res.data.data)
    } catch (err) {
      console.error('Gagal fetch banner', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-lg mx-auto mb-4"></div>
        <div className="relative w-full max-w-[1440px] mx-auto h-[500px] bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
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

  if (banners.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        Tidak ada banner
      </div>
    )

  return (
    <div className="w-full flex flex-col gap-6 relative">
      <h1 className="header-top-product text-center font-[700] text-2xl">What&apos;s New?</h1>

      <div className="relative w-full max-w-[1440px] mx-auto">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          grabCursor={true}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
            bulletClass:
              'swiper-pagination-bullet !bg-gray-400 !w-3 !h-3 rounded-full',
            bulletActiveClass:
              'swiper-pagination-bullet-active !bg-black',
          }}
          className="w-full h-[500px] rounded-lg"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Image
                src={banner.imageUrl}
                alt={`Banner ${banner.id}`}
                width={1440}
                height={500}
                className="w-full h-full rounded-lg object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="cursor-pointer custom-prev absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
          <ChevronLeft className="w-9 h-9 text-gray-800" />
        </button>

        <button className="cursor-pointer custom-next absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
          <ChevronRight className="w-9 h-9 text-gray-800" />
        </button>
      </div>

      <div className="custom-pagination flex justify-center mt-2"></div>
    </div>
  )
}
