'use client'
import React from "react";
import {
  Headphones,
  Gem,
  Box,
  Truck,
  Gamepad2
} from "lucide-react";

export default function SuggestCard() {
  const SuggestContent = [
    {
      logo: <Headphones className="w-10 h-10 text-blue-500" />,
      title: "Free Consultation",
      content:
        "Not sure which gear fits your style? Our team is ready to guide you and help you choose the perfect equipment.",
    },
    {
      logo: <Gem className="w-10 h-10 text-purple-500" />,
      title: "Premium Products",
      content:
        "We only provide high-quality gaming gear that has been tested and trusted to deliver the best performance for every gamer.",
    },
    {
      logo: <Box className="w-10 h-10 text-orange-500" />,
      title: "Safe Packing",
      content:
        "Every package is carefully packed with extra protection to ensure your gear arrives in perfect condition.",
    },
    {
      logo: <Truck className="w-10 h-10 text-green-500" />,
      title: "Fast Delivery",
      content:
        "Your order will be shipped quickly and reliably, so you can enjoy your gaming setup without unnecessary delays.",
    },
    {
      logo: <Gamepad2 className="w-10 h-10 text-red-500" />,
      title: "Trusted by Gamers",
      content:
        "Thousands of gamers rely on us for their keyboards, mice, and accessories, making us a trusted choice in the gaming community.",
    },
  ];

  return (
    <section className="flex flex-col gap-10 relative">
      <h1 className="text-center font-bold text-2xl text-gray-900">
        Why Us?
      </h1>

      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {SuggestContent.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-5 bg-white border rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition"
            >
              <div className="shrink-0">{item.logo}</div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-[18rem]">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {SuggestContent.slice(3, 5).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-5 bg-white border rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition"
            >
              <div className="shrink-0">{item.logo}</div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-[18rem]">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
