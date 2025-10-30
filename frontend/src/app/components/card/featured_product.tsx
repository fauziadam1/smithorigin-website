'use client';
import React, { useState, useEffect } from "react";
import api from "../../../../lib/axios";
import { ProductCard } from "./product_card";
import { Product } from "../../../../lib/product";

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="relative w-full h-[180px] bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function FeaturedProduct() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("best-seller");

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

  const tabItems = [
    { id: "best-seller", label: "Best Seller" },
    { id: "new-product", label: "New Product" },
    { id: "all", label: "All" },
  ];

  const filteredProducts = (() => {
    switch (activeTab) {
      case "best-seller":
        return allProducts.filter((p) => p.isBestSeller);
      case "new-product":
        return [...allProducts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return allProducts;
    }
  })();

  if (loading)
    return (
      <div>
        <h1 className="font-[700] text-2xl mb-2">Featured Product</h1>
        <div className="flex justify-start items-center gap-3 mb-4">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );

  return (
    <div>
      <h1 className="font-bold text-2xl mb-2">Featured Product</h1>

      <div className="flex gap-5 border-b border-gray-200 mb-4">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'best-seller' | 'new-product')}
            className={`pb-2 cursor-pointer relative text-base font-medium transition-colors ${activeTab === tab.id
              ? 'text-red-800 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-800'
              : 'text-gray-500 hover:text-red-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        key={activeTab}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-3 animate-fadeIn"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
