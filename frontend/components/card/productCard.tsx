import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Image } from "@heroui/react";
import { BsStar as Filled } from 'react-icons/bs';
import { BsStarFill as IsFilled } from 'react-icons/bs';

export function CardProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState(new Set());

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://can-weekend-pet-emily.trycloudflare.com/api/products');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : data.products || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(productId)) {
                newWishlist.delete(productId);
            } else {
                newWishlist.add(productId);
            }
            return newWishlist;
        });
    };

    if (loading) {
        return <div className="text-center py-8">Loading produk...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <button 
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return <div className="text-center py-8">Tidak ada produk tersedia</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <div key={product.id} className="w-full relative">
                    <Link href={`/product/${product.id}`}>
                        <Image 
                            isZoomed 
                            src={product.image || "/Product1.jpg"} 
                            alt={product.name}
                            className="w-full"
                        />
                        <div className="py-3 grid gap-1">
                            <p className="text-[15px] truncate inline-block">
                                {product.name}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h1 className="font-[600] text-[19px] md:text-[14px]">
                                    Rp {product.price?.toLocaleString('id-ID')}
                                </h1>
                                {product.originalPrice && (
                                    <h1 className="text-[14px] md:text-[11px] line-through text-[#a7a7a7]">
                                        Rp {product.originalPrice?.toLocaleString('id-ID')}
                                    </h1>
                                )}
                            </div>
                            <p className="text-[13px] md:text-[11px] text-[#a7a7a7]">
                                Sold {product.sold || 0}
                            </p>
                        </div>
                    </Link>
                    <Button 
                        onClick={() => toggleWishlist(product.id)} 
                        className="relative bg-transparent border-1 border-[#CCC] rounded-full w-full mt-2"
                    >
                        {wishlist.has(product.id) ? <IsFilled /> : <Filled />}
                        Wishlist
                    </Button>
                </div>
            ))}
        </div>
    );
}