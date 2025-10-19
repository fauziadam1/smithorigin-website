'use client'
import Image from "next/image";
export function CardBrand() {
    return (
        <div>
            <section className="max-w-5xl mx-auto">
                    <div className="text-center pb-4">
                        <h1 className="text-lg md:text-xl">Brand We Have</h1>
                    </div>
                    <div className="grid grid-cols-5 place-items-center gap-5">
                        <Image
                            src="/Logo Aula.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo Leobog.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo Vortex.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo WK.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                        <Image
                            src="/Logo MCHOSE.png"
                            alt="Brand Logo"
                            width={150}
                            height={150}
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 object-contain"
                        />
                    </div>
            </section>
        </div>
    )
}
