'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Tabs, Tab, Button, Image } from "@heroui/react";
import { BsStar as Filled, BsStarFill as IsFilled } from "react-icons/bs";

function CardProduct() {
  const [isFilled, setIsFilled] = useState(false);

  return (
    <div className="w-[250px] 2xl:w-[230px] md:w-[190px] relative">
      <Link href="/product">
        <Image isZoomed src="/Product1.jpg" alt="product" />
        <div className="py-3 grid gap-1">
          <p className="text-[15px] truncate inline-block">
            Weikav WK75 - 3 Mode - 75% - South Face RGB
          </p>
          <div className="flex items-baseline gap-2">
            <h1 className="font-[600] text-[19px] md:text-[14px]">
              Rp 599.000
            </h1>
            <h1 className="text-[14px] md:text-[11px] line-through text-[#a7a7a7]">
              Rp 399.000
            </h1>
          </div>
        </div>
      </Link>
      <Button
        onClick={() => setIsFilled(!isFilled)}
        className="relative bg-transparent border-1 border-[#CCC] rounded-full w-full"
      >
        {isFilled ? <IsFilled /> : <Filled />} Wishlist
      </Button>
    </div>
  );
}

// 🔹 Tabs Component
export default function FeaturedProduct() {
  const tabs = [
    {
      id: "best-seller",
      label: "Best Seller",
      content: <CardProduct />,
    },
    {
      id: "new-product",
      label: "New Product",
      content: <CardProduct />,
    },
    {
      id: "all",
      label: "All",
      content: <CardProduct />,
    },
  ];

  return (
    <div>
      <h1 className="font-[700] text-2xl mb-2">Featured Product</h1>
      <Tabs
        aria-label="Dynamic tabs"
        items={tabs}
        variant="underlined"
        className="-translate-x-3 mb-2 font-[500]"
      >
        {tabs.map((item) => (
          <Tab key={item.id} title={item.label}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
              {item.content}
              {item.content}
              {item.content}
              {item.content}
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
