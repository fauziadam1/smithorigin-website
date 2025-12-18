'use client'
import Link from 'next/link';
import Image from 'next/image';
import api from '../../../../lib/axios';
import { useState, useEffect } from 'react';
import { ChevronRight as Arrow, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAlert } from '@/app/components/ui/Alert';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/ui/AuthContext';
import { useFavorite } from '@/app/components/ui/FavoriteContext';
import { AiOutlineHeart as HeartIcon, AiFillHeart as HeartFillIcon } from 'react-icons/ai';

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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  imageUrl: string;
  categoryId: number | null;
  category: ProductCategory | null;
  variants: ProductVariant[];
  shopeeUrl?: string | null;
  tokopediaUrl?: string | null;
}

function SkeletonMain() {
  return (
    <div className="w-full flex items-start gap-10 animate-pulse">
      <div className="flex flex-col gap-5 w-md">
        <div className="w-md h-112 bg-gray-200 rounded-xl" />
        <div className="flex items-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="flex items-center gap-5">
          <div className="w-full h-12 bg-gray-200 rounded" />
          <div className="w-full h-12 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-160">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-1/4 bg-gray-200 rounded mb-8" />
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-40 bg-gray-200 rounded mt-6" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRelated() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="w-full aspect-square bg-gray-200 rounded-xl" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
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
  const { user } = useAuth()
  const { favoriteIds, toggleFavorite } = useFavorite()

  const isFavorite = favoriteIds.includes(Number(productId))
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'detail' | 'info'>('detail');
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const THUMBNAILS_PER_PAGE = 4;

  useEffect(() => {
    if (productId) void fetchProduct()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const fetchProduct = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Product }>(`/products/${productId}`);
      const data = response.data.data;
      setProduct(data);
      setSelectedImage(data.imageUrl || '');
      if (data.categoryId) {
        await fetchRelatedProducts(data.categoryId, data.id);
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error(error);
      showAlert('Gagal memuat produk');
      router.push('/user');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: number, excludeId?: number): Promise<void> => {
    try {
      const response = await api.get<{ data: Product[] }>(
        `/products?categoryId=${categoryId}&limit=6`
      );
      const filtered = response.data.data.filter(
        (p) => p.id !== (excludeId ? excludeId : parseInt(productId))
      );
      setRelatedProducts(filtered.slice(0, 5));
    } catch (error) {
      console.error('Error fetching related products:', error);
      setRelatedProducts([]);
    }
  };

  const selectVariant = (variant: ProductVariant): void => {
    if (selectedVariant === variant.id) {
      setSelectedVariant(null);
      setSelectedImage(product?.imageUrl || '');
    } else {
      setSelectedVariant(variant.id);
      setSelectedImage(variant.imageUrl || product?.imageUrl || '');
    }
  };

  const calculateFinalPrice = (price: number, discount: number | null): number => {
    return discount ? price - (price * discount) / 100 : price;
  };

  if (loading) {
    return (
      <section className="container px-10 py-40 mx-auto flex flex-col gap-10">
        <div className="w-full flex items-center text-sm text-gray-600">
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <SkeletonMain />
        <div className="w-full mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
          </div>
          <SkeletonRelated />
        </div>
      </section>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan</div>;
  }

  const variantSelectedObj = product.variants.find((v) => v.id === selectedVariant) || null;
  const displayPrice = variantSelectedObj?.price ?? product.price;
  const finalPrice = calculateFinalPrice(displayPrice, product.discount);

  const allImages = [product.imageUrl, ...product.variants.map((v) => v.imageUrl).filter(Boolean)].filter(Boolean) as string[];

  const truncatedName =
    product.name.length > 40 ? product.name.slice(0, 37).trim() + '...' : product.name;

  const visibleThumbnails = allImages.slice(thumbnailStartIndex, thumbnailStartIndex + THUMBNAILS_PER_PAGE);
  const canScrollLeft = thumbnailStartIndex > 0;
  const canScrollRight = thumbnailStartIndex + THUMBNAILS_PER_PAGE < allImages.length;

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1));
    } else {
      setThumbnailStartIndex(Math.min(allImages.length - THUMBNAILS_PER_PAGE, thumbnailStartIndex + 1));
    }
  };

  return (
    <section className="container px-10 py-40 mx-auto h-fit flex items-start justify-center">
      <div className="flex flex-col items-center gap-25">
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="w-full flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-red-800 cursor-pointer">
              Home
            </Link>
            <span className="mx-2">
              <Arrow className="w-4 h-4 translate-y-0.5" />
            </span>
            <span className="text-gray-900 truncate max-w-60" title={product.name}>
              {truncatedName}
            </span>
          </div>

          <div className="w-full flex items-start gap-10">
            <div className="flex flex-col gap-5">
              <div className="relative w-md h-112 border border-gray-200 rounded-xl overflow-hidden">
                <Image
                  src={selectedImage || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative flex items-center gap-3">
                {canScrollLeft && (
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2 transition -translate-x-3"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                )}

                <div className="flex items-center gap-5 overflow-hidden">
                  {visibleThumbnails.map((img, index) => {
                    const actualIndex = thumbnailStartIndex + index;
                    return (
                      <div
                        key={actualIndex}
                        onClick={() => setSelectedImage(img)}
                        className={`w-24 h-24 border-2 rounded-lg overflow-hidden cursor-pointer transition shrink-0 ${selectedImage === img ? 'border-red-800' : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`thumbnail ${actualIndex + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>

                {canScrollRight && (
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2 transition translate-x-3"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>

              <div className='w-full flex items-center gap-5'>
                <Link
                  href={product.shopeeUrl && product.shopeeUrl.trim() !== "" ? product.shopeeUrl : "#"}
                  target="_blank"
                  className='w-full flex items-center gap-5'
                >
                  <button
                    className={`w-full cursor-pointer rounded-full text-white font-medium py-3 transition
        ${product.shopeeUrl ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'}
      `}
                    disabled={!product.shopeeUrl}
                  >
                    Shopee
                  </button>
                </Link>

                <Link
                  href={product.tokopediaUrl && product.tokopediaUrl.trim() !== "" ? product.tokopediaUrl : "#"}
                  target="_blank"
                  className='w-full flex items-center gap-5'
                >
                  <button
                    className={`w-full cursor-pointer rounded-full text-white font-medium py-3 transition
        ${product.tokopediaUrl ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}
      `}
                    disabled={!product.tokopediaUrl}
                  >
                    Tokopedia
                  </button>
                </Link>
              </div>

            </div>

            <div className='w-160'>
              <div className='flex items-start justify-between'>
                <div className='flex flex-col gap-3'>
                  <h1 className='text-2xl font-medium max-w-140'>{product.name}</h1>
                  <div className='flex items-center gap-3'>
                    {product.discount && (
                      <span className='text-lg text-gray-400 line-through'>
                        Rp {displayPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <p className='text-4xl font-medium text-button'>
                      Rp {finalPrice?.toLocaleString('id-ID')}
                    </p>
                    {product.discount && (
                      <span className='bg-red-500 text-white text-sm px-2 py-1 rounded'>
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>

                <button onClick={() => toggleFavorite(Number(productId))} className='p-3 cursor-pointer hover:bg-gray-100 rounded-full transition'>
                  {isFavorite ? (
                    <HeartFillIcon className='w-7 h-7 text-red-500' />
                  ) : (
                    <HeartIcon className='w-7 h-7 text-gray-400' />
                  )}
                </button>
              </div>

              <div className='w-full h-px rounded-full bg-gray-200 my-8' />

              {product.variants.length > 0 && (
                <>
                  <div className='flex flex-col gap-2'>
                    <h1 className='font-medium'>Pilih Warna:</h1>
                    <div className='flex gap-2 flex-wrap'>
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => selectVariant(variant)}
                          className={`px-4 py-2 border cursor-pointer rounded-lg transition ${selectedVariant === variant.id
                            ? 'border-red-800 bg-red-100 text-button'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          {variant.color}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='w-full h-px rounded-full bg-gray-200 my-8' />
                </>
              )}

              <div>
                <div className='flex border-b border-gray-200'>
                  <button
                    onClick={() => setActiveTab('detail')}
                    className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === 'detail'
                      ? 'border-b-2 border-button text-button'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === 'info'
                      ? 'border-b-2 border-button text-button'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Info Penting
                  </button>
                </div>

                <div className='py-4'>
                  {activeTab === 'detail' ? (
                    <div className='text-gray-700 whitespace-pre-line'>
                      {product.description || 'Tidak ada deskripsi'}
                    </div>
                  ) : (
                    <div className='text-gray-700'>
                      <p>Kategori: {product.category?.name || '-'}</p>
                      <p>Garansi Toko</p>
                      <p>Produk Original</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className='w-full flex flex-col gap-5 mt-10'>
            <div className='flex items-center justify-between'>
              <h1 className='font-semibold text-xl'>Mungkin Anda Tertarik</h1>
              {product.category && (
                <Link
                  href={`/user?category=${product.categoryId}`}
                  className='text-sm text-button hover:underline'
                >
                  Lihat semua di {product.category.name}
                </Link>
              )}
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
              {relatedProducts.map((relatedProduct) => {
                const relatedFinalPrice = calculateFinalPrice(
                  relatedProduct.price,
                  relatedProduct.discount
                );
                const hasDiscount = relatedProduct.discount && relatedProduct.discount > 0;

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/user/product/${relatedProduct.id}`}
                    className='group'
                  >
                    <div className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300'>
                      <div className='relative w-full aspect-square overflow-hidden'>
                        <Image
                          src={relatedProduct.imageUrl || '/placeholder.jpg'}
                          alt={relatedProduct.name}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-300'
                        />

                        {hasDiscount && (
                          <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
                            -{relatedProduct.discount}%
                          </div>
                        )}
                      </div>

                      <div className='p-4'>
                        <h3 className='text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-button transition-colors'>
                          {relatedProduct.name}
                        </h3>

                        <div className='flex items-baseline gap-2'>
                          <span className='text-lg font-bold text-button'>
                            Rp {relatedFinalPrice.toLocaleString('id-ID')}
                          </span>
                          {hasDiscount && (
                            <span className='text-xs text-gray-400 line-through'>
                              Rp {relatedProduct.price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>

                        {relatedProduct.category && (
                          <p className='text-xs text-gray-500 mt-2'>
                            {relatedProduct.category.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {relatedProducts.length === 0 && product.category && (
          <div className='w-full flex flex-col items-center gap-3 mt-10 py-10 bg-gray-50 rounded-xl'>
            <p className='text-gray-500'>Belum ada produk lain dalam kategori {product.category.name}</p>
            <Link href='/user/store'>
              <button className='px-6 py-2 bg-button cursor-pointer text-white rounded-full hover:opacity-90 transition'>
                Lihat Semua Produk
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}