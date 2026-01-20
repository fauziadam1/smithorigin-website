"use client";
import Link from "next/link";
import Image from "next/image";
import api from "../../../../lib/axios";
import { Product } from "@/lib/product";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAlert } from "@/app/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "@/app/components/ui/productcard";
import { useFavorite } from "@/app/components/ui/favoritecontext";
import { ChevronRight as Arrow, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AiOutlineHeart as HeartIcon,
  AiFillHeart as HeartFillIcon,
} from "react-icons/ai";

interface ProductVariant {
  id: number;
  color: string;
  imageUrl: string;
  price?: number | null;
}

interface ProductCategory {
  id: number;
  name: string;
}

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  discount: number | null;
  imageUrl: string;
  categoryId: number;
  description?: string;
  variants: ProductVariant[];
  category?: ProductCategory;
  shopeeUrl?: string;
  tokopediaUrl?: string;
}

function SkeletonMain() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-10 animate-pulse">
      <div className="flex flex-col gap-4 lg:gap-5 w-full lg:w-auto">
        <div className="w-full aspect-square lg:w-[448px] lg:h-[448px] bg-gray-200 rounded-xl" />
        <div className="flex items-center gap-3 lg:gap-5 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg shrink-0"
            />
          ))}
        </div>
        <div className="flex items-center gap-3 lg:gap-5">
          <div className="w-full h-12 bg-gray-200 rounded" />
          <div className="w-full h-12 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-full lg:w-160">
        <div className="h-6 sm:h-8 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="h-5 sm:h-6 w-1/2 bg-gray-200 rounded mb-4" />
        <div className="h-6 sm:h-8 w-1/4 bg-gray-200 rounded mb-6 lg:mb-8" />
        <div className="space-y-4">
          <div className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-200 rounded" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-9 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded"
              />
            ))}
          </div>
          <div className="h-32 sm:h-40 bg-gray-200 rounded mt-6" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRelated() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2 sm:space-y-3">
          <div className="w-full aspect-square bg-gray-200 rounded-xl" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { showAlert } = useAlert();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;
  const { favoriteIds, toggleFavorite } = useFavorite();

  const isFavorite = favoriteIds.includes(Number(productId));
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"detail" | "info">("detail");
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [showChevrons, setShowChevrons] = useState({
    left: false,
    right: false,
  });
  const [allImages, setAllImages] = useState<string[]>([]);

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productId) void fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (product) {
      const images = [
        product.imageUrl,
        ...(product.variants || []).map((v) => v.imageUrl).filter(Boolean),
      ].filter(Boolean) as string[];
      setAllImages(images);
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 110) {
        setShowStickyTitle(true);
      } else {
        setShowStickyTitle(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (thumbnailContainerRef.current && allImages.length > 0) {
        const container = thumbnailContainerRef.current;
        const isOverflowing = container.scrollWidth > container.clientWidth;

        if (isOverflowing) {
          const atStart = container.scrollLeft <= 1;
          const atEnd =
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth - 1;

          setShowChevrons({
            left: !atStart,
            right: !atEnd,
          });
        } else {
          setShowChevrons({ left: false, right: false });
        }
      }
    };

    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);

    const container = thumbnailContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkOverflow);
    }

    checkOverflow();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
      if (container) {
        container.removeEventListener("scroll", checkOverflow);
      }
    };
  }, [allImages.length]);

  const fetchProduct = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<{ data: ProductDetail }>(
        `/products/${productId}`,
      );
      const data = response.data.data;
      setProduct(data);
      setSelectedImage(data.imageUrl || "");
      if (data.categoryId) {
        await fetchRelatedProducts(data.categoryId, data.id);
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error(error);
      showAlert("Gagal memuat produk", "error");

      setTimeout(() => {
        router.push("/user");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (
    categoryId: number,
    excludeId?: number,
  ): Promise<void> => {
    try {
      const response = await api.get<{ data: Product[] }>(
        `/products?categoryId=${categoryId}&limit=13`,
      );
      const filtered = response.data.data.filter(
        (p) => p.id !== (excludeId ? excludeId : parseInt(productId)),
      );
      setRelatedProducts(filtered.slice(0, 12));
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts([]);
    }
  };

  const selectVariant = (variant: ProductVariant): void => {
    if (selectedVariant === variant.id) {
      setSelectedVariant(null);
      setSelectedImage(product?.imageUrl || "");
    } else {
      setSelectedVariant(variant.id);
      setSelectedImage(variant.imageUrl || product?.imageUrl || "");
    }
  };

  const calculateFinalPrice = (
    price: number,
    discount: number | null,
  ): number => {
    return discount ? price - (price * discount) / 100 : price;
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 120;
      const currentScroll = thumbnailContainerRef.current.scrollLeft;

      thumbnailContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (thumbnailContainerRef.current) {
          const container = thumbnailContainerRef.current;
          const atStart = container.scrollLeft <= 1;
          const atEnd =
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth - 1;

          setShowChevrons({
            left: !atStart,
            right: !atEnd,
          });
        }
      }, 300);
    }
  };

  if (loading) {
    return (
      <section className="container px-4 sm:px-6 lg:px-10 py-24 sm:py-32 lg:py-40 mx-auto flex flex-col gap-6 lg:gap-10">
        <div className="w-full flex items-center text-xs sm:text-sm text-gray-600">
          <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded" />
        </div>
        <SkeletonMain />
        <div className="w-full mt-6 lg:mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-200 rounded" />
          </div>
          <SkeletonRelated />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        Produk tidak ditemukan
      </div>
    );
  }

  const variantSelectedObj =
    product.variants?.find((v) => v.id === selectedVariant) || null;
  const displayPrice = variantSelectedObj?.price ?? product.price;
  const finalPrice = calculateFinalPrice(displayPrice, product.discount);

  const truncatedName =
    product.name.length > 40
      ? product.name.slice(0, 37).trim() + "..."
      : product.name;

  return (
    <section className="container px-4 sm:px-6 lg:px-10 py-24 sm:py-32 lg:py-40 mx-auto h-fit">
      {showStickyTitle && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="hidden lg:block fixed top-[90px] left-0 right-0 z-40 bg-white border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-10 py-3 flex items-center justify-between">
            <h1 className="font-bold text-lg truncate max-w-[70%]">
              {product.name}
            </h1>

            <span className="text-button font-semibold text-lg">
              Rp {finalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </motion.div>
      )}
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 lg:gap-25">
        <div className="flex flex-col gap-4 lg:gap-5 w-full">
          <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
            <div className="flex flex-col gap-4 lg:gap-5 w-full lg:w-auto lg:sticky lg:top-33">
              <div className="w-full flex items-center text-xs sm:text-sm text-gray-600">
                <Link href="/" className="hover:text-red-800 cursor-pointer">
                  Home
                </Link>
                <span className="mx-1 sm:mx-2">
                  <Arrow className="w-3 h-3 sm:w-4 sm:h-4 translate-y-0.5" />
                </span>
                <span
                  className="text-gray-900 truncate max-w-[200px] sm:max-w-60"
                  title={product.name}
                >
                  {truncatedName}
                </span>
              </div>

              <div className="relative w-full aspect-square lg:w-[448px] lg:h-[448px] border border-gray-200 rounded-xl overflow-hidden">
                <Image
                  src={selectedImage || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 448px"
                  priority
                />
              </div>

              <div className="relative flex items-center w-full lg:w-[448px]">
                {showChevrons.left && (
                  <button
                    onClick={() => scrollThumbnails("left")}
                    className="absolute cursor-pointer left-0 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-1.5 sm:p-2 transition-all -translate-x-2 sm:-translate-x-3 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                )}

                <div
                  ref={thumbnailContainerRef}
                  className="flex items-center gap-2 sm:gap-3 lg:gap-5 overflow-x-auto w-full scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 border-2 rounded-lg overflow-hidden cursor-pointer transition shrink-0 ${
                        selectedImage === img
                          ? "border-red-800"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumbnail ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                {showChevrons.right && (
                  <button
                    onClick={() => scrollThumbnails("right")}
                    className="absolute cursor-pointer right-0 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-1.5 sm:p-2 transition-all translate-x-2 sm:translate-x-3 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                )}
              </div>

              <div className="w-full flex items-center gap-3 sm:gap-4 lg:gap-5">
                <Link
                  href={
                    product.shopeeUrl && product.shopeeUrl.trim() !== ""
                      ? product.shopeeUrl
                      : "#"
                  }
                  target="_blank"
                  className="w-full flex items-center gap-5"
                >
                  <button
                    className={`w-full cursor-pointer rounded-full text-white text-sm sm:text-base font-medium py-2.5 sm:py-3 transition
        ${product.shopeeUrl ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-400 cursor-not-allowed"}
      `}
                    disabled={!product.shopeeUrl}
                  >
                    Shopee
                  </button>
                </Link>

                <Link
                  href={
                    product.tokopediaUrl && product.tokopediaUrl.trim() !== ""
                      ? product.tokopediaUrl
                      : "#"
                  }
                  target="_blank"
                  className="w-full flex items-center gap-5"
                >
                  <button
                    className={`w-full cursor-pointer rounded-full text-white text-sm sm:text-base font-medium py-2.5 sm:py-3 transition
        ${product.tokopediaUrl ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}
      `}
                    disabled={!product.tokopediaUrl}
                  >
                    Tokopedia
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-160 flex flex-col">
              <div className="bg-white z-20 pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-medium max-w-full lg:max-w-140">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {product.discount && (
                        <span className="text-base sm:text-lg text-gray-400 line-through">
                          Rp {displayPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-button">
                        Rp {finalPrice?.toLocaleString("id-ID")}
                      </p>
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const wasFavorite = isFavorite;
                      toggleFavorite(Number(productId));

                      showAlert(
                        wasFavorite
                          ? "Dihapus dari wishlist"
                          : "Ditambahkan ke wishlist",
                        wasFavorite ? "error" : "success",
                      );
                    }}
                    className="p-2 sm:p-3 cursor-pointer hover:bg-gray-100 rounded-full transition shrink-0"
                  >
                    {isFavorite ? (
                      <HeartFillIcon className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="flex flex-col gap-2 bg-white mt-3 sm:mt-4">
                  <h1 className="font-medium text-sm sm:text-base">
                    Pilih Warna:
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => selectVariant(variant)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border cursor-pointer rounded-lg transition ${
                          selectedVariant === variant.id
                            ? "border-red-800 bg-red-100 text-button"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white z-10 mt-3 sm:mt-4">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("detail")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium cursor-pointer transition ${
                      activeTab === "detail"
                        ? "border-b-2 border-button text-button"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Detail
                  </button>
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                {activeTab === "detail" ? (
                  <div className="text-sm sm:text-base text-gray-700 whitespace-pre-line pb-4">
                    {product.description || "Tidak ada deskripsi"}
                  </div>
                ) : (
                  <div className="text-sm sm:text-base text-gray-700 pb-12 sm:pb-16 lg:pb-20">
                    <p>Kategori: {product.category?.name || "-"}</p>
                    <p>Garansi Toko</p>
                    <p>Produk Original</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="w-full flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 lg:mt-10">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-base sm:text-lg lg:text-xl">
                Mungkin Anda Tertarik
              </h1>
              {product.category && (
                <Link
                  href={`/user/category/${product.categoryId}`}
                  className="text-sm sm:text-base font-bold text-button text-red-800 hover:text-red-700"
                >
                  Lihat semua
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {relatedProducts.length === 0 && product.category && (
          <div className="w-full flex flex-col items-center gap-3 mt-6 sm:mt-8 lg:mt-10 py-8 sm:py-10 rounded-xl">
            <p className="text-sm sm:text-base text-gray-500 text-center px-4">
              Belum ada produk lain dalam kategori {product.category.name}
            </p>
            <Link href={`/user/store?category=${product.categoryId}`}>
              <button className="px-5 sm:px-6 py-2 text-sm sm:text-base bg-button cursor-pointer text-white rounded-full hover:opacity-90 transition">
                Lihat Semua Produk
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
