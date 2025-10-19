'use client'
import clsx from "clsx"
import Link from "next/link"
import * as React from "react"
import Image from "next/image"
import { SignIn } from "../logoSVG"
import { Button } from "@heroui/button";
import { HiMiniUser as UserIcon } from 'react-icons/hi2';
import { usePathname } from "next/navigation"
import { BiSearchAlt2 as SearchIcon } from 'react-icons/bi';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"

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

                <div className="flex items-center gap-7">
                    <div>
                        <ul className="flex items-center gap-7 font-[500]">
                            <li className={(isHome && !navbarScrolled ? "text-white hover:text-gray-300 transition-colors cursor-pointer" : "text-black hover:text-gray-600 transition-colors cursor-pointer")}>
                                <Link href="#">Home</Link>
                            </li>
                            <li className={(isHome && !navbarScrolled ? "text-white hover:text-gray-300 transition-colors cursor-pointer" : "text-black hover:text-gray-600 transition-colors cursor-pointer")}>
                                <Link href="/forum">Forum</Link>
                            </li>
                        </ul>
                    </div>

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

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-0 cursor-pointer">
                                <Avatar className="w-12 h-12 outline-0">
                                    <AvatarImage src="" alt="Profil" />
                                    <AvatarFallback><UserIcon className="text-3xl" /></AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="mt-2" align="end">
                                <DropdownMenuGroup className="flex flex-col gap-2 p-1">
                                    <Button className="font-[500]" variant="light">Dashboard Admin</Button>
                                    <Button className="font-[500] bg-red-500 text-white">Log Out</Button>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    )
}
