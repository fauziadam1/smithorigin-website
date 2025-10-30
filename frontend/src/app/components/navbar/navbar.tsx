'use client'
import clsx from "clsx"
import Link from "next/link"
import * as React from "react"
import Image from "next/image"
import { LogIn } from 'lucide-react'
import { Button } from "@heroui/button"
import { useState, useEffect } from "react"
import { getAuth, clearAuth } from "../../../../lib/auth"
import { usePathname, useRouter } from "next/navigation"
import { HiMiniUser as UserIcon } from 'react-icons/hi2'
import { BiSearchAlt2 as SearchIcon } from 'react-icons/bi'
import { AiOutlineHeart as FavoriteIcon } from 'react-icons/ai'
import { getUserColor } from "../../../../utils/color"

interface User {
    username: string
    email: string
    isAdmin?: boolean
    avatarUrl?: string
}

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const isHome = pathname === "/user"

    const [navbarScrolled, setNavbarScrolled] = React.useState(false)
    const [isOpened, setIsOpened] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // ✅ Check authentication safely
    useEffect(() => {
        const auth = getAuth()
        if (auth?.token && auth?.user) {
            setUser(auth.user)
            setIsAuthenticated(true)
        } else {
            setUser(null)
            setIsAuthenticated(false)
        }
    }, [pathname])

    // ✅ Scroll effect for home header
    React.useEffect(() => {
        if (!isHome) return

        const handleScroll = () => {
            setNavbarScrolled(window.scrollY > window.innerHeight - 80)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isHome])

    const handleLogout = () => {
        clearAuth()
        setUser(null)
        setIsAuthenticated(false)
        setIsOpened(false)
        router.push('/')
    }

    const navClass = clsx(
        "fixed z-[1000] w-full mx-auto py-6 transition-colors duration-300",
        isHome
            ? navbarScrolled
                ? "bg-white text-foreground border-b border"
                : "bg-transparent"
            : "bg-white text-foreground border-b border"
    )

    return (
        <nav className={navClass}>
            <div className="container mx-auto px-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/Logo.png" alt="Logo" width={50} height={50} />
                    <h1
                        className={clsx(
                            "font-[700] text-[15px] leading-5 transition-colors",
                            isHome && !navbarScrolled ? "text-white" : "text-black"
                        )}
                    >
                        SMITH <br /> ORIGIN
                    </h1>
                </Link>

                <div className="flex items-center gap-7">
                    {/* Links */}
                    <ul className="flex items-center gap-7 font-[500]">
                        {[
                            { name: "Home", href: "/user" },
                            { name: "Forum", href: "/user/forum" },
                            { name: "Store", href: "/user/store" },
                        ].map((item) => (
                            <li
                                key={item.name}
                                className={clsx(
                                    "cursor-pointer transition-colors",
                                    isHome && !navbarScrolled
                                        ? "text-white hover:text-gray-300"
                                        : "text-black hover:text-gray-600"
                                )}
                            >
                                <Link href={item.href}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>

                    <form
                        action="POST"
                        className={clsx(
                            "bg-background/30 py-3 px-5 text-[12px] flex items-center gap-3 rounded-full mr-2",
                            isHome && !navbarScrolled
                                ? "border-none text-white"
                                : "border border-gray-300 text-black"
                        )}
                    >
                        <label htmlFor="search">
                            <SearchIcon
                                className={clsx(
                                    "w-[20px] h-[20px]",
                                    isHome && !navbarScrolled ? "text-white" : "text-black"
                                )}
                            />
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            id="search"
                            className={clsx(
                                "outline-none border-none bg-transparent",
                                isHome && !navbarScrolled
                                    ? "text-white placeholder-white"
                                    : "text-black placeholder-gray-600"
                            )}
                        />
                    </form>

                    {!isAuthenticated && (
                        <Link href="/auth/sign-in">
                            <button className="bg-red-800 hover:bg-red-700 flex item-center gap-3 rounded-full px-4 py-3 text-white font-[500] cursor-pointer">
                                <LogIn className="w-5 h-5" />
                                Log In
                            </button>
                        </Link>
                    )}

                    {isAuthenticated && (
                        <>
                            <Link href="/user/favorites">
                                <button
                                    className={clsx(
                                        "p-3 rounded-full transition-colors",
                                        isHome && !navbarScrolled
                                            ? "text-white hover:bg-white/20"
                                            : "text-black hover:bg-gray-100"
                                    )}
                                >
                                    <FavoriteIcon className="w-6 h-6" />
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

                                        <div className="w-52 mt-3 p-2 right-0 bg-white absolute rounded-xl shadow-lg border z-20 flex flex-col gap-2">
                                            <div className="px-2 py-3 border-b">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`w-9 h-9 ${getUserColor(user?.username || '')} rounded-full flex items-center justify-center`}>
                                                        <span className="text-sm font-semibold text-black">
                                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{user?.username}</p>
                                                        <p className="text-[10px] text-gray-500 max-w-[120px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={clsx(
                                                        "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                                                        user?.isAdmin
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-blue-100 text-blue-600"
                                                    )}
                                                >
                                                    {user?.isAdmin ? "Admin" : "User"}
                                                </span>
                                            </div>

                                            {user?.isAdmin && (
                                                <Link
                                                    className="w-full font-[500] py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-sm text-blue-600"
                                                    href="/admin"
                                                    onClick={() => setIsOpened(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <Link
                                                className="w-full font-[500] py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                                href="/user/favorites"
                                                onClick={() => setIsOpened(false)}
                                            >
                                                My Favorites
                                            </Link>

                                            <hr className="my-1" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full font-[500] text-white py-2 px-3 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-sm"
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