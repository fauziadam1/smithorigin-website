'use client'
import Image from "next/image"

export function BrandCard() {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Our Partner Brands
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Brands we trust for quality and innovation
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-20 place-items-center">
        {[
          "/Logo Aula.png",
          "/Logo Leobog.png",
          "/Logo Vortex.png",
          "/Logo WK.png",
          "/Logo MCHOSE.png",
        ].map((src, i) => (
          <div
            key={i}
            className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24"
          >
            <Image
              src={src}
              alt={`Brand ${i + 1}`}
              width={100}
              height={100}
              className="object-contain w-full h-full opacity-90"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
