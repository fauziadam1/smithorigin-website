'use client'
import React from 'react'
import { Button } from "@heroui/button";
import Link from 'next/link';
import { BsArrowLeft as ArrowIcon } from 'react-icons/bs';
import { PiNotePencilDuotone as EditIcon } from 'react-icons/pi';
import { Form, Input, Textarea } from "@heroui/react";
import { PiPaperPlaneRightFill as PlaneIcon } from 'react-icons/pi';
import { LuCircleAlert as Alert } from 'react-icons/lu';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../components/ui/card"

export default function forumForm() {
    return (
        <div>
            <section className='w-full h-screen container mx-auto px-10 py-45'>
                <div className='w-[55rem] mx-auto flex flex-col gap-8'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <EditIcon className='text-5xl text-button' />
                            <h1 className='font-[600] text-4xl'>Bagikan Pendapat Anda</h1>
                        </div>
                        <Link href='/forum'>
                            <Button className='text-[16px] bg-transparent border-1 border-[#CCC] rounded-full w-full' startContent={<ArrowIcon className='text-[18px]' />}>Kembali ke Forum</Button>
                        </Link>
                    </div>
                    <div>
                        <Card className='flex flex-col gap'>
                            <CardHeader className='flex flex-col gap-1 mb-4'>
                                <CardTitle className='font-[600] text-[18px]'>Detail Percakapan</CardTitle>
                                <CardDescription className='text-[14px]'>Isi detail berikut untuk memulai diskusi baru</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex flex-col gap-7'>
                                    <Form className='flex flex-col gap-3'>
                                        <h1 className='text-[15px] font'>Judul Topik</h1>
                                        <Input placeholder='Berikan judul diskusi' variant='bordered' />
                                        <CardDescription className='text-[11px]'>Buat judul yang singkat dan jelas.</CardDescription>
                                    </Form>
                                    <Form className='flex flex-col gap-3'>
                                        <h1 className='text-[15px] font'>Pendapat atau Saran Anda</h1>
                                        <Textarea placeholder='Tuliskan apa yang ada di benak Anda' variant='bordered' onClear={() => console.log("textarea cleared")} />
                                        <CardDescription className='text-[11px]'>Kritik maupun saran akan sangat membantu website ini untuk lebih berkembang dan inovatif.</CardDescription>
                                    </Form>
                                    <CardAction className='flex items-center w-full justify-end'>
                                        <Button className='bg-button text-white font-[500] rounded-full py-3' startContent={<PlaneIcon className='rotate-180' />}>Kirim Percapakan</Button>
                                    </CardAction>
                                </div>
                            </CardContent>
                            <div className='w-full border-1' />
                            <CardFooter className='mx-auto'>
                                <CardDescription className='text-[11px] flex items-center gap-2'>
                                    <Alert className='text-[15px] text-button'/>
                                    Ingatlah untuk bijak dalam berkomunikasi dan menjaga privasi.
                                </CardDescription>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}