import { Button } from "@heroui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full absolute left-0 space-x-0">
      <section className="w-full h-screen bg-cover bg-center bg-hero pt-15">
        <div className="container mx-auto px-10 flex items-center justify-between">
          <div className="flex flex-col items-start justify-center h-[80vh] text-white gap-5">
            <h1 className="text-button font-[900] text-3xl xl:text-7xl sm:text-6xl">
              LEVEL UP <br />
              <span className="text-background text-5xl xl:text-5xl sm:text-5xl font-[700]">YOUR GAMING GEAR</span>
            </h1>
            <p className="max-w-md md:max-w-lg md:text-sm sm:text-[13px] sm:max-w-sm">
              Toko penyedia gaming gear nomor 1 di Indonesia. Ikuti terus perkembangan dan produk terbaru dari kami.
            </p>
            <Button className="bg-button text-white font-[500] md:py-6 md:px-7 md:text-[15px] sm:" radius="full">
              Start Shopping
            </Button>
          </div>
          <Image src="/Logo.png" alt="Logo" width={330} height={330} className="hidden lg:block xl:-translate-x-30 xl:w-80 lg:w-70"/>
        </div>
      </section>
      <section className="bg-background w-full h-screen ">
        <div className="container mx-auto px-10">
          <div className="-translate-y-20">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-center pb-4">
                  <h1 className="text-lg md:text-xl">Brand We Have</h1>
                </CardTitle>
                <CardContent className="grid grid-cols-5 place-items-center gap-5">
                  <Image
                    src="/Logo Aula.png"
                    alt="Brand Logo"
                    width={150}
                    height={150}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-40 md:h-40 object-contain"
                  />
                  <Image
                    src="/Logo Leobog.png"
                    alt="Brand Logo"
                    width={150}
                    height={150}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-40 md:h-40 object-contain"
                  />
                  <Image
                    src="/Logo Vortex.png"
                    alt="Brand Logo"
                    width={150}
                    height={150}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-40 md:h-40 object-contain"
                  />
                  <Image
                    src="/Logo WK.png"
                    alt="Brand Logo"
                    width={150}
                    height={150}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-40 md:h-40 object-contain"
                  />
                  <Image
                    src="/Logo MCHOSE.png"
                    alt="Brand Logo"
                    width={150}
                    height={150}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-40 md:h-40 object-contain"
                  />
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
