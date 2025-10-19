import Link from "next/link";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Image } from "@heroui/react";
import { BsStar as Filled } from 'react-icons/bs';
import { BsStarFill as IsFilled } from 'react-icons/bs';

export function CardProduct() {

    const [isFilled, setIsFilled] = useState(false);

    return (
        <div className="w-[250px] 2xl:w-[230px] md:w-[190px] relative">
            <Link href="/product">
                <Image isZoomed src="/Product1.jpg" alt="product" width={200} height={200} />
                <div className="py-3 grid gap-1">
                    <p className="text-[15px] truncate inline-block">Weikav WK75 - 3 Mode - 75% - South Face RGB </p>
                    <div className="flex items-baseline gap-2">
                        <h1 className="font-[600] text-[19px] md:text-[14px]">Rp 599.000</h1>
                        <h1 className="text-[14px] md:text-[11px] line-through text-[#a7a7a7]">Rp 399.000</h1>
                    </div>
                    <p className="text-[13px] md:text-[11px] text-[#a7a7a7]">Sold 15</p>
                </div>
            </Link>
            <Button onClick={() => setIsFilled(!isFilled)} className="relative bg-transparent border-1 border-[#CCC] rounded-full w-full">{isFilled ? <IsFilled /> : <Filled />}Wishlist</Button>
        </div>
    )
}