import { useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { BsStarFill as IsFilled } from 'react-icons/bs';
import { BsStar as Filled } from 'react-icons/bs';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export function CardProduct() {

    const [isFilled, setIsFilled] = useState(false);

    return (
        <div className="w-[250px] 2xl:w-[230px] md:w-[190px] relative">
            <Link href="#">
                <Image src="/Product1.jpg" alt="product" width={250} height={250} />
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

export function CardBrand() {
    return (
        <div className="-translate-y-15">
            <Card className="max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center pb-4">
                        <h1 className="text-lg md:text-xl">Brand We Have</h1>
                    </CardTitle>
                    <CardContent className="grid grid-cols-5 place-items-center gap-5">
                        <Image
                            src="/Logo Aula.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo Leobog.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo Vortex.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo WK.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo MCHOSE.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}
