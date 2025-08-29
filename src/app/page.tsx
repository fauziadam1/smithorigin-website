'use client'
import { Button } from "@heroui/button";
import { Button as Btn } from "@/components/ui/button"
import Image from "next/image";
import { CardProduct, CardBrand } from "./components/card";

export default function Home() {
  return (
    <div className="w-full absolute left-0 space-x-0">
      <section className="w-full h-screen bg-cover bg-center bg-hero pt-15">
        <div className="container mx-auto px-10 flex items-center justify-between">
          <div className="flex flex-col items-start justify-center h-[80vh] text-white gap-5">
            <h1 className="text-button font-[900] text-5xl md:text-7xl sm:text-7xl leading-10 md:leading-15 sm:leading-14">
              LEVEL UP <br />
              <span className="text-background text-3xl md:text-5xl sm:text-5xl font-[700]">YOUR GAMING GEAR</span>
            </h1>
            <p className="max-w-md md:max-w-lg text-[12px] md:text-sm sm:text-[13px] sm:max-w-sm">
              Toko penyedia gaming gear nomor 1 di Indonesia. Ikuti terus perkembangan dan produk terbaru dari kami.
            </p>
            <Button className="bg-button text-white font-[500] md:py-6 md:px-7 md:text-[15px] sm:" radius="full">
              Start Shopping
            </Button>
          </div>
          <Image src="/Logo.png" alt="Logo" width={330} height={330} className="hidden lg:block xl:translate-x-5 xl:w-80 lg:w-70" />
        </div>
      </section>
      <section className="bg-background w-full h-screen ">
        <div className="container mx-auto px-10">
          <div className="-translate-y-20">
            <CardBrand />

            <div className="grid grid-cols-3 grid-rows-2 gap-4 bg-black">
              <Image src="/Keyboard.jpg" alt="Logo" width={330} height={330} className="row-span-2 w-full" />
              <Image src="/Mouse.jpg" alt="Logo" width={330} height={330} className="" />
              <Image src="/KeyCaps.jpg" alt="Logo" width={330} height={330} className="col-start-2" />
              <Image src="/Headset.jpg" alt="Logo" width={330} height={330} className="row-span-2 col-start-3 row-start-1 w-full" />
            </div>

            <div className="translate-y-40">
              <h1 className="mb-6 font-[700] text-2xl">Best Seller</h1>
              <div className="grid grid-cols-6 gap-4">
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full h-screen bg-background">

      </section>
    </div>
  );
}
