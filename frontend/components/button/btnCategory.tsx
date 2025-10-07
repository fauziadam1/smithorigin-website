'use client'
import React from 'react'
import { Image } from "@heroui/react";
import Link from 'next/link';

export function ButtonCategory() {
    return (
        <div className='w-full flex flex-col gap-10'>
            <h1 className='header-top-product text-center text-2xl font-[700]'>Category</h1>
            <section className='relative justify-center grid grid-flow-col auto-cols-max gap-20'>
                <Link href='#' className='flex flex-col text-center gap-3 w-fit h-fit'>
                    <Image isZoomed alt='Category' src="/KeyCaps.jpg" width={180} height={180} />
                    <h1 className='font-[600]'>KeyCaps</h1>
                </Link>
                <Link href='#' className='flex flex-col text-center gap-3 w-fit h-fit'>
                    <Image isZoomed alt='Category' src="/Keyboard.jpg" width={180} height={180} />
                    <h1 className='font-[600]'>Keyboard</h1>
                </Link>
                <Link href='#' className='flex flex-col text-center gap-3 w-fit h-fit'>
                    <Image isZoomed alt='Category' src="/Mouse.jpg" width={180} height={180} />
                    <h1 className='font-[600]'>Mouse</h1>
                </Link>
                <Link href='#' className='flex flex-col text-center gap-3 w-fit h-fit'>
                    <Image isZoomed alt='Category' src="/Headset.jpg" width={180} height={180} />
                    <h1 className='font-[600]'>Headset</h1>
                </Link>
            </section>
        </div>
    )
}
