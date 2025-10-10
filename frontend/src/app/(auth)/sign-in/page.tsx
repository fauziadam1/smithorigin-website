'use client'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../components/ui/card"
import { Form, Input, Textarea } from "@heroui/react";
import { BsStars as Star } from 'react-icons/bs';
import { Link as LINK } from "@heroui/link";
import Link from "next/link";
import { PiSignInBold as Signin } from 'react-icons/pi';
import { Button } from "@heroui/react";

export default function SignIn() {
    return (
        <section className="container px-10 mx-auto flex items-center justify-center h-screen">
            <div className="flex items-center justify-center">
                <Card className="w-[35rem] h-fit py-15">
                    <CardHeader className="flex flex-col gap-10 items-center relative">
                        <CardTitle className="text-center">
                            <h1 className="text-2xl flex items-center justify-center gap-2">Selamat Datang Kembali<Star className="text-yellow-500" /></h1>
                            <CardDescription className="font-light">
                                Masuk untuk memulai pencarian anda di toko kami.
                            </CardDescription>
                        </CardTitle>
                        <CardContent className="w-full flex flex-col">
                            <Form className="relative gap-5">
                                <Input className="" variant="bordered" label="Email" type="email" />
                                <Input className="" variant="bordered" label="Password" type="password" />
                            </Form>
                            <div className="flex items-center justify-end py-4">
                                <LINK className="text-button text-[15px]" href="/" underline="always">Lupa kata sandi?</LINK>
                            </div>
                            <div className="flex flex-col gap-5">
                                <Button className="bg-button w-full text-white font-[500] py-6" radius="full" startContent={<Signin className="text-[20px]" />}>
                                    Masuk
                                </Button>
                                <Link href="/sign-up">
                                    <Button className="w-full font-[500] py-6" variant="bordered" radius="full">
                                        Buat Akun Baru
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </section>
    )
}