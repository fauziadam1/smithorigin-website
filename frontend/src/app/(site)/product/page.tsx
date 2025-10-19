'use client'
import { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"
import { ButtonGroup, Image } from "@heroui/react"
import { Tabs, Tab } from "@heroui/react";
import { Button } from '@heroui/react'

export default function ProductPage() {
    const [selectedImage, setSelectedImage] = useState("/product1.jpg")
    const [selectedColor, setSelectedColor] = useState('white')

    const thumbnails = [
        "/product1.jpg",
        "/KeyCaps.jpg",
        "/Keyboard.jpg",
        "/Mouse.jpg"
    ]

    return (
        <div>
            <section className="container px-10 mx-auto h-screen flex items-start justify-center">
                <div className="py-40 flex flex-col items-center gap-5">
                    <div className="w-full">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Product</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="w-full flex items-start gap-10">
                        <div className="flex flex-col gap-5">
                            <Image
                                className="w-[28rem] h-[28rem]"
                                isZoomed
                                src={selectedImage}
                                alt="product"
                            />
                            <div className="flex items-center gap-5">
                                {thumbnails.map((img, index) => (
                                    <Image
                                        key={index}
                                        className="w-[6rem] h-[6rem] cursor-pointer"
                                        isZoomed
                                        src={img}
                                        alt={`product thumbnail ${index + 1}`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='w-[40rem]'>
                            <span className='flex flex-col gap-3'>
                                <h1 className='text-2xl font-[500] max-w-[40rem]'>ATK U2 Pro PAW 3395 Ultra Wireless Gaming Mouse - White</h1>
                                <p className='text-4xl font-[600]'>Rp 599.000</p>
                            </span>
                            <div className='w-full h-[1px] rounded-full bg-gray-200 my-8' />
                            <div className='flex flex-col gap-2'>
                                <h1 className='font-[500]'>Pilih Warna: {selectedColor}</h1>
                                <div>
                                    <ButtonGroup>
                                        <Button className='border-1' variant='ghost' onClick={() => setSelectedColor('White')}>White</Button>
                                        <Button className='border-1' variant='ghost' onClick={() => setSelectedColor('Black')}>Black</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className='w-full h-[1px] rounded-full bg-gray-200 my-8' />
                            <div className=''>
                                <Tabs className='-translate-x-2' aria-label='Dynamic tabs' variant='underlined'>
                                    <Tab title="Detail" className='w-full'>
                                        Garansi Toko 3 Bulan <br />
                                        Product model: SMART875 <br />
                                        Switch : Huano Arctic Latte <br />
                                        75% Layout (84 keys), Pre-built <br />
                                        Connection : 2.4G Wireless/Bluetooth 5.0/USB-C Wired <br />
                                        Number of keys: 84 <br />
                                        Mounting : Gasket Mount <br />
                                        CNC 6063 Aluminum Body <br />
                                        Cherry Profile <br />
                                        Battery capacity: 8000mAh <br />
                                        Product weight: about 2100g
                                    </Tab>
                                    <Tab title="Info Penting">Info Penting</Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}