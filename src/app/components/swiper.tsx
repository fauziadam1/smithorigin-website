"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Button } from "@heroui/button";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
    return (
        <div className="w-full mx-auto translate-y-30">
            <Swiper
                modules={[Pagination, Autoplay]}
                autoplay={{ delay: 500000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1}
                grabCursor={true}
                pagination={{ clickable: true }}
                className="h-[540px] relative"
            >
                <SwiperSlide>
                    <div className="w-full h-full">
                        <div className="absolute translate-x-23 translate-y-30 flex flex-col gap-8 max-w-5xl">
                            <h1 className="text-background font-[700] text-3xl trans">Veekos Shine60 HE 60% Rapid Trigger RT 0.01mm Snap Key Magnetic Switch Keyboard</h1>
                            <p className="text-background">The Shine60 HE Hall Effect mechanical keyboard embraces a compact 60% layout while delivering exceptional performance and versatility. It features a robust 7,000 mAh internal battery that ensures extended, uninterrupted usage without frequent recharging ......</p>
                            <Button className="bg-button text-white font-[500] rounded-full px-11 py-6 w-auto self-start">Buy Now</Button>
                        </div>
                        <Image
                            src="/SlideImage.jpg"
                            alt="Slide 1"
                            width={300}
                            height={300}
                            className="w-full h-[500px] rounded-lg"
                        />
                    </div>
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
