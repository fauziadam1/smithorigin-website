'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Gamepad2, Package, ChevronRight } from 'lucide-react'
import api from '../../../../lib/axios'
import { ProductCard } from '@/app/components/card/product_card'
import { Product } from '../../../../lib/product'

interface Category {
    id: number
    name: string
    imageUrl: string | null
    _count?: { products: number }
}

interface ProductsByCategory {
    [categoryId: number]: Product[]
}

interface ApiResponse<T> {
    data: T
}

function SkeletonGrid(): React.JSX.Element {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                    <div className="aspect-square bg-gray-200 rounded-xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    )
}

export default function StorePage(): React.JSX.Element {
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<'best-seller' | 'new-product'>('best-seller')

    const PRODUCTS_PER_ROW = 6
    const MAX_ROWS = 7
    const MAX_PRODUCTS = PRODUCTS_PER_ROW * MAX_ROWS

    useEffect(() => {
        void fetchData()
    }, [])

    const fetchData = async (): Promise<void> => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get<ApiResponse<Product[]>>('/products?limit=100'),
                api.get<ApiResponse<Category[]>>('/categories'),
            ])

            const products = productsRes.data.data
            const cats = categoriesRes.data.data

            setAllProducts(products)
            setCategories(cats)

            const grouped: ProductsByCategory = {}
            for (const p of products) {
                if (typeof p.categoryId !== 'number') continue
                if (!grouped[p.categoryId]) grouped[p.categoryId] = []
                grouped[p.categoryId].push(p)
            }

            setProductsByCategory(grouped)
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts =
        activeTab === 'best-seller'
            ? allProducts.filter((p) => p.isBestSeller)
            : [...allProducts].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

    return (
        <div className="bg-gray-50 py-32">
            <section className="container mx-auto px-10">
                <div className="mb-12 bg-linear-to-r from-red-900 via-red-800 to-red-900 rounded-3xl p-10 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <Gamepad2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold mb-2">Smith Origin</h1>
                                <p className="text-xl text-red-100">
                                    Ultimate Gaming Store for the Best Gaming Experience
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold mb-1">{allProducts.length}+</div>
                            <p className="text-red-100">Gaming Products</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-red-800" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                    </div>

                    <div className="flex gap-6 border-b border-gray-200 mb-8">
                        {[
                            { id: 'best-seller' as const, label: 'Best Seller' },
                            { id: 'new-product' as const, label: 'New Product' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-2 relative cursor-pointer text-base font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-red-800 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-800'
                                    : 'text-gray-500 hover:text-red-800'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <SkeletonGrid />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                                {filteredProducts.slice(0, MAX_PRODUCTS).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {filteredProducts.length > MAX_PRODUCTS && (
                                <div className="mt-8 text-center">
                                    <Link href={`/user/store/${activeTab}`}>
                                        <button className="px-8 py-3 bg-red-800 text-white rounded-full hover:bg-red-900 transition-all font-semibold flex items-center gap-2 mx-auto">
                                            <span>View All {filteredProducts.length} Products</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="space-y-12">
                    {categories.map((category) => {
                        const products = productsByCategory[category.id] || []
                        if (products.length === 0) return null

                        const showAll = products.length > MAX_PRODUCTS
                        const visibleProducts = products.slice(0, MAX_PRODUCTS)

                        return (
                            <div key={category.id} className="bg-white rounded-2xl p-8">
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
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
