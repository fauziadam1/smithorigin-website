'use client';
import Link from "next/link";
import api from "../../../../lib/axios";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./product_card";
import { Product } from "../../../../lib/product";
import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
  _count?: { products: number };
}

interface ProductsByCategory {
  [categoryId: number]: Product[];
}

interface ApiResponse<T> {
  data: T;
}

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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
      {[...Array(12)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default function FeaturedProduct() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({});
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"best-seller" | "new-product" | "all">(
    "best-seller"
  );

  const PRODUCTS_PER_ROW = 6;
  const MAX_ROWS = 7;
  const MAX_PRODUCTS = PRODUCTS_PER_ROW * MAX_ROWS;

  const tabItems: { id: "best-seller" | "new-product" | "all"; label: string }[] = [
    { id: "best-seller", label: "Best Seller" },
    { id: "new-product", label: "New Product" },
    { id: "all", label: "All" },
  ];

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get<ApiResponse<Product[]>>("/products?limit=100"),
        api.get<ApiResponse<Category[]>>("/categories"),
      ]);

      const products = productsRes.data.data;
      const cats = categoriesRes.data.data;

      setAllProducts(products);
      setCategories(cats);

      const grouped: ProductsByCategory = {};
      for (const p of products) {
        if (typeof p.categoryId !== "number") continue;
        if (!grouped[p.categoryId]) grouped[p.categoryId] = [];
        grouped[p.categoryId].push(p);
      }

      setProductsByCategory(grouped);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-12" id="featured-product">
      <h1 className="font-bold text-2xl mb-2">Featured Product</h1>

      <div className="flex gap-5 border-b border-gray-200 mb-4">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 cursor-pointer relative text-base font-medium transition-colors ${activeTab === tab.id
                ? 'text-red-800 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-800'
                : "text-gray-500 hover:text-red-800"
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
        {loading
          ? [...Array(12)].map((_, i) => <ProductSkeleton key={i} />)
          : filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>

      <div className="space-y-12">
        {categories.map((category) => {
          const products = productsByCategory[category.id] || [];
          if (products.length === 0) return null;

          const showAll = products.length > MAX_PRODUCTS;
          const visibleProducts = products.slice(0, MAX_PRODUCTS);

          return (
            <div key={category.id}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>

              {loading ? (
                <SkeletonGrid />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {showAll && (
                <div className="mt-8 text-center">
                  <Link href={`/user/store/category/${category.id}`}>
                    <button className="px-8 py-3 bg-red-800 text-white rounded-full hover:bg-red-900 transition-all font-semibold flex items-center gap-2 mx-auto">
                      <span>
                        View All {products.length} {category.name} Products
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
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
