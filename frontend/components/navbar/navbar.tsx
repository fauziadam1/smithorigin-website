'use client'
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { usePathname } from "next/navigation"  // ⬅ untuk cek halaman aktif
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { Button } from "@heroui/button";
import { SignIn } from "../logoSVG"
import { BiSearchAlt2 as SearchIcon } from 'react-icons/bi';
import clsx from "clsx"

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/"

    const [navbarScrolled, setNavbarScrolled] = React.useState(false);

    React.useEffect(() => {
        if (!isHome) return;

        const handleScroll = () => {
            if (window.scrollY > window.innerHeight - 80) {
                setNavbarScrolled(true);
            } else {
                setNavbarScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    const navClass = clsx(
        "fixed z-[1000] w-full mx-auto py-6 transition-colors duration-300",
        isHome
            ? (navbarScrolled ? "bg-white text-foreground border-b border" : "bg-transparent")
            : "bg-white text-foreground border-b border"
    );

    return (
        <nav className={navClass}>
            <div className="container mx-auto px-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/Logo.png" alt="Logo" width={50} height={50} />
                    <h1 className={clsx("font-[700] text-[15px] leading-5 transition-colors", (isHome && !navbarScrolled) ? "text-white" : "text-black")}>
                        SMITH <br /> ORIGIN
                    </h1>
                </Link>

                <div className="flex items-center gap-6">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), (isHome && !navbarScrolled) ? "text-white" : "text-black")}>
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), (isHome && !navbarScrolled) ? "text-white" : "text-black")}>
                                    <Link href="/forum">Forum</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), (isHome && !navbarScrolled) ? "text-white" : "text-black")}>
                                    <Link href="/products">Product</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <form action="POST" className={clsx(
                        "bg-background/30 py-3 px-5 text-[12px] flex items-center gap-3 rounded-full mr-2",
                        (isHome && !navbarScrolled) ? "border-none text-white" : "border border-gray-300 text-black"
                    )}>
                        <label htmlFor="search">
                            <SearchIcon className={clsx("w-[20px] h-[20px]", (isHome && !navbarScrolled) ? "text-white" : "text-black")} />
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            id="search"
                            className={clsx("outline-none border-none bg-transparent", (isHome && !navbarScrolled) ? "text-white placeholder-white" : "text-black placeholder-gray-600")}
                        />
                    </form>

                    <Link href='/sign-in'>
                        <Button className="bg-button text-white font-[500] py-6" radius="full" startContent={<SignIn />}>
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
