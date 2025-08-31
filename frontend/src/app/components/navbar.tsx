'use client'
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuContentLink,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@heroui/button";
import { SignIn } from "./logoSVG"
import { BiSearchAlt2 as SearchIcon } from 'react-icons/bi';
import clsx from "clsx"

export default function Header() {

    const [navbarScrolled, setNavbarScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight - 80) {
                setNavbarScrolled(true);
            } else {
                setNavbarScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed z-[1000] w-full mx-auto py-6 transition-colors duration-300 ${navbarScrolled ? "bg-white text-foreground border-b-1 border-[#CCCC]" : "bg-transparent"}`}>
            <div className="container mx-auto px-10 flex items-center justify-between">
                <Link href="#" className="flex items-center gap-2">
                    <Image src="/Logo.png" alt="Logo" width={50} height={50} />
                    <h1 className={clsx("font-[700] text-[15px] leading-5 transition-colors", navbarScrolled ? "text-black" : "text-white")}>SMITH <br /> ORIGIN</h1>
                </Link>
                <div className="flex items-center gap-6">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), navbarScrolled ? "text-black" : "text-white")}>
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), navbarScrolled ? "text-black" : "text-white")}>
                                    <Link href="/">Forum</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={clsx(navigationMenuTriggerStyle(), navbarScrolled ? "text-black" : "text-white")}>
                                    <Link href="/">Product</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <form action="POST" className={clsx("bg-background/30 py-3 px-5 text-[12px] text-background flex items-center gap-3 rounded-full mr-2", navbarScrolled ? "border-1 border-[#CCCCC]" : "border-none")}>
                        <label htmlFor="search">
                            <SearchIcon className={clsx("w-[20px] h-[20px]", navbarScrolled ? "text-foreground" : "text-background")} />
                        </label>
                        <input type="text" placeholder="Search..." className={clsx("outline-none border-none", navbarScrolled ? "text-foreground placeholder-foreground" : "text-background placeholder-background")} id="search" />
                    </form>
                    <Button className="bg-button text-white font-[500] py-6" radius="full" startContent={<SignIn />}>
                        Sign In
                    </Button>
                </div>
            </div>
        </nav >
    )
}