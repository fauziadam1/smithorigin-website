import Image from "next/image"
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function Header() {
    return (
        <nav className="fixed z-[1000] w-full mx-auto px-25 py-4">
            <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center">
                    <Image src="/Logo.png" alt="Logo" width={70} height={70} />
                    <h1 className="text-white font-[700]">SMITH <br /> ORIGIN</h1>
                </Link>
                <div>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Category</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>Keyboard</NavigationMenuLink>
                                    <NavigationMenuLink>Mouse</NavigationMenuLink>
                                    <NavigationMenuLink>Keycaps</NavigationMenuLink>
                                    <NavigationMenuLink>Speaker</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </nav>
    )
}