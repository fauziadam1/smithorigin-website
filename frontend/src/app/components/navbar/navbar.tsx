import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/product"
import { useAuth } from "../ui/authcontext"
import { clearAuth } from "../../../lib/auth"
import { LogIn, Search, X } from 'lucide-react'
import { getUserColor } from "../../../utils/color"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AiOutlineHeart as FavoriteIcon } from 'react-icons/ai'

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()
    const searchRef = useRef<HTMLDivElement>(null)

    const [navbarScrolled, setNavbarScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isOpened, setIsOpened] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const isAuthenticated = !!user
    const isHome = mounted && pathname === "/user"

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (isHome) {
            setNavbarScrolled(window.scrollY > window.innerHeight - 80)

            const handleScroll = () => {
                setNavbarScrolled(window.scrollY > window.innerHeight - 80)
            }

            window.addEventListener("scroll", handleScroll)
            return () => window.removeEventListener("scroll", handleScroll)
        } else {
            setNavbarScrolled(true)
        }
    }, [mounted, isHome])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([])
                setShowSearchResults(false)
                return
            }

            setIsSearching(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/products?search=${encodeURIComponent(searchQuery)}&limit=5`
                )
                const result = await response.json()

                if (result.data) {
                    setSearchResults(result.data)
                    setShowSearchResults(true)
                }
            } catch (error) {
                console.error("Search error:", error)
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        }

        const debounceTimer = setTimeout(searchProducts, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleLogout = () => {
        clearAuth()
        setIsOpened(false)
        router.push('/')
    }

    const handleProductClick = (productId: number) => {
        router.push(`/user/product/${productId}`)
        setShowSearchResults(false)
        setSearchQuery("")
    }

    const clearSearch = () => {
        setSearchQuery("")
        setSearchResults([])
        setShowSearchResults(false)
    }

    const formatPrice = (price: number, discount?: number) => {
        const finalPrice = discount ? price - (price * discount / 100) : price
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(finalPrice)
    }

    const navClass = clsx(
        "fixed z-[1000] w-full mx-auto py-6 transition-colors duration-300",
        isHome
            ? navbarScrolled
                ? "bg-white text-foreground border-b border-gray-200"
                : "bg-transparent"
            : "bg-white text-foreground border-b border-gray-200"
    )

    const navItems = [
        { name: "Home", href: "/user" },
        { name: "Forum", href: "/user/forum" }
    ]

    if (!mounted) return null

    return (
        <nav className={navClass}>
            <div className="container mx-auto px-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/LogoMain.png" alt="Logo" width={50} height={50} />
                    <h1
                        className={clsx(
                            "font-extrabold text-[15px] leading-5 transition-colors",
                            isHome && !navbarScrolled ? "text-white" : "text-black"
                        )}
                    >
                        SMITH <br /> ORIGIN
                    </h1>
                </Link>

                <div className="flex items-center gap-7">
                    <ul className="flex items-center gap-7 font-medium">
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/user" && pathname.startsWith(item.href))
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            "transition-colors",
                                            isHome && !navbarScrolled
                                                ? isActive
                                                    ? "text-red-800 font-semibold"
                                                    : "text-white hover:text-gray-300"
                                                : isActive
                                                    ? "text-red-800 font-semibold"
                                                    : "text-black hover:text-gray-600"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <div ref={searchRef} className="relative">
                        <div
                            className={clsx(
                                "bg-white/30 py-3 px-5 text-[12px] flex items-center gap-3 rounded-full",
                                isHome && !navbarScrolled
                                    ? "border-none text-white"
                                    : "border border-gray-200 text-black"
                            )}
                        >
                            <label htmlFor="search">
                                <Search
                                    className={clsx(
                                        "w-4 h-4 cursor-pointer",
                                        isHome && !navbarScrolled ? "text-white" : "text-gray-500"
                                    )}
                                />
                            </label>
                            <input
                                type="text"
                                placeholder="Cari product"
                                id="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                className={clsx(
                                    "outline-none border-none bg-transparent pr-5 w-50",
                                    isHome && !navbarScrolled
                                        ? "text-white placeholder-white/70"
                                        : "text-black placeholder-gray-600"
                                )}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className={clsx(
                                        "hover:opacity-70 cursor-pointer absolute right-5 transition-opacity",
                                        isHome && !navbarScrolled ? "text-white" : "text-gray-500"
                                    )}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {showSearchResults && (
                            <div className="absolute top-full mt-2 w-full min-w-[380px] bg-white rounded-xl border border-gray-200 z-50 max-h-[450px] no-scrollbar overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-6 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto mb-2"></div>
                                        <p className="text-gray-500 text-sm">Mencari Product...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="py-2">
                                        {searchResults.map((product) => {
                                            const finalPrice = product.discount && product.discount > 0
                                                ? product.price - (product.price * product.discount / 100)
                                                : product.price;

                                            return (
                                                <div
                                                    key={product.id}
                                                    onClick={() => handleProductClick(product.id)}
                                                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-13 h-13 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                            {product.imageUrl ? (
                                                                <Image
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    width={1200}
                                                                    height={1200}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Search className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-black truncate mb-1">
                                                                {product.name}
                                                            </p>

                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-sm text-red-800">
                                                                    {formatPrice(finalPrice)}
                                                                </p>
                                                                {product.discount && product.discount > 0 && (
                                                                    <>
                                                                        <p className="text-xs text-gray-400 line-through">
                                                                            {formatPrice(product.price)}
                                                                        </p>
                                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold">
                                                                            -{product.discount}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">
                                            Maaf yang kamu cari tidak ada
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Coba pakai kata kunci lain untuk mencari
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!isAuthenticated && (
                        <Link href="/auth/login">
                            <button
                                className={clsx(
                                    "flex items-center cursor-pointer gap-2 rounded-full px-5 py-3 font-medium transition-all duration-200 bg-red-800 text-white hover:bg-red-900 shadow-sm"
                                )}
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="text-sm">Log In</span>
                            </button>
                        </Link>
                    )}
                    {isAuthenticated && (
                        <>
                            <Link href="/user/favorites" className={clsx(
                                "border rounded-full",
                                isHome && !navbarScrolled
                                    ? "border-white/30"
                                    : "border-gray-200"
                            )}>
                                <button
                                    className={clsx(
                                        "p-3 rounded-full transition-colors cursor-pointer",
                                        isHome && !navbarScrolled
                                            ? "text-white hover:bg-white/20"
                                            : "text-black hover:bg-gray-100"
                                    )}
                                >
                                    <FavoriteIcon className="w-5 h-5" />
                                </button>
                            </Link>

                            <div className="relative">
                                <div
                                    onClick={() => setIsOpened(!isOpened)}
                                    className={`w-12 h-12 ${getUserColor(user?.username || '')} rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                    <span className="text-lg font-semibold text-black">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>

                                {isOpened && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsOpened(false)}
                                        />

                                        <div className="w-52 mt-3 p-2 right-0 bg-white absolute rounded-xl shadow-lg border border-gray-200 z-20 flex flex-col gap-2">
                                            <div className="px-2 py-3 border-b border-gray-200">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`w-9 h-9 ${getUserColor(user?.username || '')} rounded-full flex items-center justify-center`}>
                                                        <span className="text-sm font-semibold text-black">
                                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{user?.username}</p>
                                                        <p className="text-[10px] text-gray-500 max-w-[120px] truncate">
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {user?.isAdmin && (
                                                <Link
                                                    className="w-full font-medium py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-sm text-blue-600"
                                                    href="/admin"
                                                    onClick={() => setIsOpened(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <Link
                                                className="w-full font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                                href="/user/favorites"
                                                onClick={() => setIsOpened(false)}
                                            >
                                                My Favorites
                                            </Link>

                                            <hr className="my-1 border-gray-200" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full font-medium cursor-pointer text-white py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}