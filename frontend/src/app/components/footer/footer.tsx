'use client'
import Image from "next/image"
import Link from "next/link"
import { Instagram, Youtube, Music2, ChevronDown } from "lucide-react"
import api from "../../../lib/axios"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section)
  }

  return (
    <footer className="bg-red-800 text-white">
      <section className="container mx-auto px-6 py-14">
        <div className="hidden lg:grid lg:grid-cols-5 gap-10">
          <div className="sm:col-span-2 text-center sm:text-left">
            <div className="flex items-center justify-start -translate-x-3.5 mb-4">
              <Image
                src="/LogoWhite.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-16 h-16"
              />
              <h1 className="font-extrabold text-white text-xl leading-tight ml-2">
                SMITH <br /> ORIGIN
              </h1>
            </div>
            <p className="text-sm text-gray-100 max-w-xs mx-auto sm:mx-0 leading-relaxed">
              Thank you for visiting our official website. We hope you are satisfied with our service and products.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-semibold text-lg mb-4">Links</h2>
            <ul className="space-y-3 text-sm text-gray-100">
              <li>
                <Link href="/" className="inline-block py-1 hover:underline hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/user/forum" className="inline-block py-1 hover:underline hover:text-white">
                  Forum
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-semibold text-lg mb-4">Category</h2>
            <ul className="space-y-3 text-sm text-gray-100">
              {loading ? (
                <>
                  <li className="animate-pulse bg-white/20 h-3 w-32 rounded mx-auto sm:mx-0"></li>
                  <li className="animate-pulse bg-white/20 h-3 w-24 rounded mx-auto sm:mx-0"></li>
                  <li className="animate-pulse bg-white/20 h-3 w-28 rounded mx-auto sm:mx-0"></li>
                </>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/user/category/${cat.id}`}
                      className="inline-block py-1 hover:underline hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-300 text-xs italic">
                  Kategori tidak tersedia
                </li>
              )}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-semibold text-lg mb-4">Follow Us</h2>
            <ul className="space-y-4 text-sm text-gray-100 flex flex-col items-center sm:items-start">
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
        </div>

        <div className="lg:hidden">
          <div className="flex flex-col items-start justify-start mb-8">
            <div className="flex items-center justify-center mb-4 -translate-x-3.5">
              <Image
                src="/LogoWhite.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-16 h-16"
              />
              <h1 className="font-extrabold text-white text-xl leading-tight ml-2">
                SMITH <br /> ORIGIN
              </h1>
            </div>
            <p className="text-sm text-gray-100 max-w-xs leading-relaxed">
              Thank you for visiting our official website. We hope you are satisfied with our service and products.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-b border-white/20">
              <button
                onClick={() => toggleDropdown('links')}
                className="w-full cursor-pointer flex items-center justify-between py-3 text-lg font-semibold"
              >
                <span>Links</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-200 ${
                    openDropdown === 'links' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === 'links' ? 'max-h-40 mb-4' : 'max-h-0'
                }`}
              >
                <ul className="space-y-3 text-sm text-gray-100 pl-2">
                  <li>
                    <Link href="/" className="inline-block py-1 hover:underline hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/forum" className="inline-block py-1 hover:underline hover:text-white">
                      Forum
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-b border-white/20">
              <button
                onClick={() => toggleDropdown('category')}
                className="w-full cursor-pointer flex items-center justify-between py-3 text-lg font-semibold"
              >
                <span>Category</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-200 ${
                    openDropdown === 'category' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === 'category' ? 'max-h-96 mb-4' : 'max-h-0'
                }`}
              >
                <ul className="space-y-3 text-sm text-gray-100 pl-2">
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
                          className="inline-block py-1 hover:underline hover:text-white"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-300 text-xs italic">
                      Kategori tidak tersedia
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-b border-white/20">
              <button
                onClick={() => toggleDropdown('social')}
                className="w-full cursor-pointer flex items-center justify-between py-3 text-lg font-semibold"
              >
                <span>Follow Us</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-200 ${
                    openDropdown === 'social' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === 'social' ? 'max-h-60 mb-4' : 'max-h-0'
                }`}
              >
                <ul className="space-y-4 text-sm text-gray-100 pl-2">
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
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#77000e] py-3">
        <div className="container mx-auto px-6 flex justify-center sm:justify-start">
          <p className="text-[12px] text-white">
            © 2025 SMITH ORIGIN. All rights reserved.
          </p>
        </div>
      </section>
    </footer>
  )
}