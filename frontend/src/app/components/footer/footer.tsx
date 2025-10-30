'use client'

import Image from "next/image"
import Link from "next/link"
import { Instagram, Youtube, Music2 } from "lucide-react"
import api from "../../../../lib/axios"
import { useEffect, useState } from "react"

interface Category {
    id: number
    name: string
}

export function Footer() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await api.get<{ data: Category[] }>("/categories")
            setCategories(res.data.data)
        } catch (err) {
            console.error("Gagal memuat kategori:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <footer className="bg-button text-background">
            <section className="container mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
                <div className="col-span-2 sm:col-span-2">
                    <div className="flex items-center mb-3 -translate-x-3">
                        <Image
                            src="/Logo White.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="w-16 h-16"
                        />
                        <h1 className="font-extrabold text-xl leading-tight ml-1">
                            SMITH <br /> ORIGIN
                        </h1>
                    </div>
                    <p className="text-sm text-gray-100 max-w-xs leading-relaxed">
                        Terima kasih telah mengunjungi website resmi kami. Semoga Anda puas
                        dengan pelayanan dan produk kami.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-3">Links</h2>
                    <ul className="space-y-2 text-sm text-gray-100">
                        <li><Link href="/" className="hover:underline hover:text-white">Home</Link></li>
                        <li><Link href="#" className="hover:underline hover:text-white">Forum</Link></li>
                        <li><Link href="#" className="hover:underline hover:text-white">Product</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-3">Category</h2>
                    <ul className="space-y-2 text-sm text-gray-100">
                        {loading ? (
                            <>
                                <li className="animate-pulse bg-white/20 h-3 w-32 rounded"></li>
                                <li className="animate-pulse bg-white/20 h-3 w-24 rounded"></li>
                                <li className="animate-pulse bg-white/20 h-3 w-28 rounded"></li>
                            </>
                        ) : categories.length > 0 ? (
                            categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/user/category/${cat.id}`}
                                        className="hover:underline hover:text-white"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-300 text-xs italic">Kategori tidak tersedia</li>
                        )}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-3">Follow Us</h2>
                    <ul className="space-y-2 text-sm text-gray-100">
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-white">
                                <Youtube size={18} /> SMITHORIGIN.ID
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-white">
                                <Instagram size={18} /> SMITHORIGIN
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 hover:text-white">
                                <Music2 size={18} /> SMITHORIGIN.ID
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="bg-[#77000e] py-3">
                <div className="container mx-auto px-6 flex justify-start items-center">
                    <p className="text-[12px] text-background">
                        © 2025 SMITH ORIGIN. All rights reserved.
                    </p>
                </div>
            </section>
        </footer>
    )
}
