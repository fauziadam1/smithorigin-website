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
import Link from "next/link";
import { BsPersonAdd as Signup } from 'react-icons/bs';
import { Button } from "@heroui/react";

export default function SignIn() {
    return (
        <section className="container px-10 mx-auto flex items-center justify-center h-screen">
            <div className="flex items-center justify-center">
                <Card className="w-[35rem] h-fit py-15">
                    <CardHeader className="flex flex-col gap-10 items-center relative">
                        <CardTitle className="text-center">
                            <h1 className="text-2xl flex items-center justify-center gap-2">Buat Akun Anda<Star className="text-yellow-500" /></h1>
                            <CardDescription className="font-light">
                                Daftar untuk masuk ke website kami.
                            </CardDescription>
                        </CardTitle>
                        <CardContent className="w-full flex flex-col gap-6">
                            <Form className="relative gap-5">
                                <Input  variant="bordered" label="Username" type="text"></Input>
                                <Input variant="bordered" label="Email" type="email" />
                                <Input variant="bordered" label="Password" type="password" />
                            </Form>
                            <div className="flex flex-col gap-5">
                                <Button className="bg-button w-full text-white font-[500] py-6" radius="full" startContent={<Signup className="text-[20px]" />}>
                                    Masuk
                                </Button>
                                <Link href="/sign-in">
                                    <Button className="w-full font-[500] py-6" variant="bordered" radius="full">
                                        Masuk ke akun anda
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