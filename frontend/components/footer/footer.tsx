import Image from "next/image"
import { Link } from "@heroui/link";
import { BsInstagram as IG, BsTiktok as TT } from 'react-icons/bs';
import { PiYoutubeLogo as YT } from 'react-icons/pi';

export function Footer() {
    return (
        <div>
            <section className="w-full h-80 bg-button py-20">
                <div className="container px-10 mx-auto flex items-start gap-20">
                    <div className="flex flex-col -translate-y-4">
                        <div className="flex items-center -translate-x-6">
                            <Image src="/Logo White.png" alt="Logo" width={100} height={100} />
                            <h1 className="font-[800] text-background text-[19px] leading-6">SMITH <br /> ORIGIN</h1>
                        </div>
                        <p className="text-background text-[12px] max-w-[16rem]">Terima kasih sudah mengunjungi website resmi kami. Semoga anda puas dengan pelayanan kami.</p>
                    </div>
                    <div className="flex items-start gap-30">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-background font-[700] text-[20px] mb-2">Links</h1>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Home</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Forum</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Product</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-background font-[700] text-[20px] mb-2">Category</h1>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Keyboard Mechanical</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Mouse</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Headset</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Keycaps</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-background font-[700] text-[20px] mb-2">Marketplace</h1>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Tokopedia</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Shoppe</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px]">Tiktok</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-background font-[700] text-[20px] mb-2">Follow Us</h1>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px] flex items-center gap-2"><YT className="text-[20px]" />SMITHORIGIN.ID</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px] flex items-center gap-2"><IG className="text-[16px]" />SMITHORIGIN</Link>
                            <Link href="#" underline="hover" className="text-[#e4e4e4] text-[13px] flex items-center gap-2"><TT className="text-[18px]" />SMITHORIGIN.ID</Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full h-15 bg-[#77000e]">
                <div className="w-full h-full container px-10 mx-auto flex justify-start items-center">
                    <p className="text-background text-[12px]">© 2025 SMITH ORIGIN. All rights reserved.</p>
                </div>
            </section>
        </div>
    )
}