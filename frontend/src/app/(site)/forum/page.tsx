import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../components/ui/card"
import { BsFillKeyboardFill as KeyboardIcon } from 'react-icons/bs';
import { RiChatNewLine as ChatPlus } from 'react-icons/ri';
import { Button } from "@heroui/button";
import ForumDiscussion from '../../../../components/card/forumCard';
import Link from 'next/link';

export default function Forum() {
    return (
        <div>
            <section className='w-full h-fit container mx-auto px-10 py-45 flex flex-col gap-10'>
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-4'>
                        <KeyboardIcon className='text-5xl text-button' />
                        <h1 className='text-4xl font-[600]'>Forum Komunitas Smith Origin</h1>
                    </div>
                    <p className='text-[13px]'>Platform untuk terhubung dan berbagi pengalaman</p>
                </div>
                <div className='flex items-start gap-5'>
                    <div className='w-full flex flex-col gap-5'>
                        <ForumDiscussion />
                    </div>
                    <div className=''>
                        <Card className='w-70 h-65 p-5 flex flex-col items-center justify-center'>
                            <ChatPlus className='text-5xl text-button w-12 h-12' />
                            <CardDescription className='text-center flex flex-col gap-1'>
                                <h1 className='font-[600] text-[19px] text-button '>Bagikan Cerita Anda</h1>
                                <p className='text-[11px]'>Mulai percapakan baru, ajukan pertanyaan, atau berikan saran</p>
                            </CardDescription>
                            <CardAction className='mx-auto'>
                                <Link href='/forumForm'>
                                    <Button className="bg-button text-white text-[13px] font-[500] py-3 px-6" radius="full">
                                        Mulai Diskusi Baru
                                    </Button>
                                </Link>
                            </CardAction>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}