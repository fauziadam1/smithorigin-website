import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import SearchBar from "../ui/searchbar"
import { useAuth } from "../ui/authcontext"
import { clearAuth } from "../../../lib/auth"
import { LogIn, Menu, X } from 'lucide-react'
import { getUserColor } from "../../../utils/color"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AiOutlineHeart as FavoriteIcon } from 'react-icons/ai'
import { motion, AnimatePresence, Variants } from "framer-motion"

const menuVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 260,
            damping: 25
        }
    },
    exit: {
        x: "100%",
        opacity: 0,
        transition: { duration: 0.25 }
    }
}

const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
}

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    const [navbarScrolled, setNavbarScrolled] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isOpened, setIsOpened] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    const handleLogout = () => {
        clearAuth()
        setIsOpened(false)
        setIsMobileMenuOpen(false)
        router.push('/')
    }

    const navClass = clsx(
        "fixed z-[1000] w-full mx-auto py-4 md:py-6 transition-colors duration-300",
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
            <div className="container mx-auto px-4 md:px-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/LogoMain.png" alt="Logo" width={50} height={50} className="w-10 h-10 md:w-[50px] md:h-[50px]" />
                    <h1
                        className={clsx(
                            "font-extrabold text-[13px] md:text-[15px] leading-4 md:leading-5 transition-colors",
                            isHome && !navbarScrolled ? "text-white" : "text-black"
                        )}
                    >
                        SMITH <br /> ORIGIN
                    </h1>
                </Link>

                <div className="hidden lg:flex items-center gap-7">
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

                    <SearchBar isHome={isHome} navbarScrolled={navbarScrolled} />

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

                <div className="flex lg:hidden items-center gap-2">
                    <SearchBar isHome={isHome} navbarScrolled={navbarScrolled} isMobile />

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={clsx(
                            "p-2 cursor-pointer rounded-full transition-colors",
                            isHome && !navbarScrolled
                                ? "text-white hover:bg-white/20"
                                : "text-black hover:bg-gray-100"
                        )}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed inset-0 bg-black/50 z-999 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <motion.div
                            ref={mobileMenuRef}
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 h-full w-[280px] bg-white z-1000 shadow-2xl lg:hidden transform transition-transform duration-300 ease-out"
                        >
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="font-bold text-lg">Menu</h2>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {isAuthenticated && user && (
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 ${getUserColor(user.username || '')} rounded-full flex items-center justify-center`}>
                                                <span className="text-lg font-semibold text-black">
                                                    {user.username?.[0]?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{user.username}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto py-2">
                                    {navItems.map((item) => {
                                        const isActive =
                                            pathname === item.href ||
                                            (item.href !== "/user" && pathname.startsWith(item.href))
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={clsx(
                                                    "block px-4 py-3 font-medium transition-colors",
                                                    isActive
                                                        ? "text-red-800 bg-red-50"
                                                        : "text-black hover:bg-gray-50"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                    })}

                                    {isAuthenticated && (
                                        <Link
                                            href="/user/favorites"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={clsx(
                                                "block px-4 py-3 font-medium transition-colors",
                                                pathname === "/user/favorites"
                                                    ? "text-red-800 bg-red-50"
                                                    : "text-black hover:bg-gray-50"
                                            )}
                                        >
                                            Wishlist
                                        </Link>
                                    )}

                                    {isAuthenticated && user?.isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                    {!isAuthenticated ? (
                                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <button className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium bg-red-800 text-white hover:bg-red-900 transition-colors">
                                                <LogIn className="w-5 h-5" />
                                                <span>Log In</span>
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                                        >
                                            <span>Log Out</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    )
}