"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
    return (
        <div className="w-full h-[520px] mx-auto translate-y-20">
            <Swiper
                modules={[Pagination, Autoplay]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1}
                grabCursor={true}
                pagination={{clickable: true}}
            >
                <SwiperSlide>
                    <Image
                        src="/banner1.jpeg"
                        alt="Slide 1"
                        width={300}
                        height={300}
                        className="w-full h-[500px] rounded-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image
                        src="/banner1.jpeg"
                        alt="Slide 2"
                        width={300}
                        height={300}
                        className="w-full h-[500px] rounded-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image
                        src="/banner1.jpeg"
                        alt="Slide 3"
                        width={300}
                        height={300}
                        className="w-full h-[500px] rounded-lg"
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
