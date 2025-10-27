'use client'
import Image from "next/image"

export function BrandCard() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-wide text-gray-800">
          Brands We Partner With
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Trusted brands that define quality and innovation
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 place-items-center gap-8 md:gap-10">
        {[
          "/Logo Aula.png",
          "/Logo Leobog.png",
          "/Logo Vortex.png",
          "/Logo WK.png",
          "/Logo MCHOSE.png",
        ].map((src, i) => (
          <div
            key={i}
            className="group relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <Image
              src={src}
              alt="Brand Logo"
              width={120}
              height={120}
              className="object-contain w-3/4 h-3/4 opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
