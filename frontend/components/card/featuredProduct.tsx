'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, Tab, Button, Image } from "@heroui/react";
import { BsStar as Filled, BsStarFill as IsFilled } from "react-icons/bs";
import api from "../../lib/axios";
import { ProductCard } from "./productCard";

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  isBestSeller: boolean;
  createdAt: string;
}

function CardProduct({ product }: { product: Product }) {
  const [isFilled, setIsFilled] = useState(false);

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price;

  return (
    <ProductCard key={product.id} product={product}/>
  );
}


export default function FeaturedProduct() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?limit=50&page=1");
      setAllProducts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "best-seller",
      label: "Best Seller",
      content: allProducts.filter(p => p.isBestSeller),
    },
    {
      id: "new-product",
      label: "New Product",
      content: [...allProducts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    },
    {
      id: "all",
      label: "All",
      content: allProducts,
    },
  ];

  if (loading) return <div>Loading...</div>;

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-3">
              {item.content.map(product => (
                <CardProduct key={product.id} product={product} />
              ))}
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
