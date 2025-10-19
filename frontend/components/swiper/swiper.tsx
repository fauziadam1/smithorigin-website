"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Button } from "@heroui/button";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
    return (
        <div className="w flex flex-col gap-10 relative">
            <h1 className="header-top-product text-center font-[700] text-2xl">Whats New?</h1>
            <div className="w-full mx-auto">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    spaceBetween={20}
                    slidesPerView={1}
                    grabCursor={true}
                    pagination={{ clickable: true }}
                    className="h-[540px] relative"
                >
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
        </div>
    );
}
