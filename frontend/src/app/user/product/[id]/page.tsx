'use client'
import Link from 'next/link';
import Image from 'next/image';
import api from '../../../../../lib/axios';
import { useState, useEffect } from 'react';
import { getAuth } from '../../../../../lib/auth';
import { ChevronRight as Arrow } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAlert } from '@/app/components/alert/alert_context';
import { AiOutlineHeart as HeartIcon, AiFillHeart as HeartFillIcon } from 'react-icons/ai';

interface ProductVariant {
  id: number;
  color: string;
  imageUrl: string;
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
}

interface Favorite {
  productId: number;
}

export default function ProductDetailPage() {
  const { showAlert } = useAlert()
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;
  const { user } = getAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'detail' | 'info'>('detail');

  useEffect(() => {
    if (productId) {
      fetchProduct();
      if (user) checkFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async (): Promise<void> => {
    try {
      const response = await api.get<{ data: Product }>(`/products/${productId}`);
      const data = response.data.data;
      setProduct(data);
      setSelectedImage(data.imageUrl || '');

      if (data.categoryId) {
        fetchRelatedProducts(data.categoryId);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal memuat produk');
      router.push('/user');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: number): Promise<void> => {
    try {
      const response = await api.get<{ data: Product[] }>(
        `/products?categoryId=${categoryId}&limit=6`
      );
      const filtered = response.data.data.filter(
        (p) => p.id !== parseInt(productId)
      );
      setRelatedProducts(filtered.slice(0, 5));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const checkFavorite = async (): Promise<void> => {
    try {
      const response = await api.get<{ data: Favorite[] }>('/favorites');
      const favorites = response.data.data;
      setIsFavorite(favorites.some((fav) => fav.productId === parseInt(productId)));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (): Promise<void> => {
    if (!user) {
      showAlert('Silakan login terlebih dahulu');
      router.push('/auth/sign-in');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${productId}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { productId: parseInt(productId) });
        setIsFavorite(true);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        // @ts-expect-error → response typing optional
        alert(error.response?.data?.message || 'Gagal mengubah favorit');
      } else {
        alert('Terjadi kesalahan.');
      }
    }
  };

  const selectVariant = (variant: ProductVariant): void => {
    setSelectedVariant(variant.id);
    setSelectedImage(variant.imageUrl || product?.imageUrl || '');
  };

  const calculateFinalPrice = (price: number, discount: number | null) => {
    return discount ? price - (price * discount) / 100 : price;
  };

  const finalPrice = calculateFinalPrice(product?.price || 0, product?.discount || null);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan</div>;
  }

  const allImages = [
    product.imageUrl,
    ...product.variants.map((v) => v.imageUrl).filter(Boolean)
  ].filter(Boolean) as string[];

  return (
    <div>
      <section className="container px-10 py-40 mx-auto h-fit flex items-start justify-center">
        <div className='flex flex-col items-center gap-25'>
          <div className="flex flex-col items-center gap-5">
            <div className="w-full flex item-center text-sm text-gray-600">
              <Link href="/" className="hover:text-button">Home</Link>
              <span className="mx-2"><Arrow className='w-4 h-4 translate-y-[2px]' /></span>
              <span className="text-gray-900">{product.name}</span>
            </div>

            <div className="w-full flex items-start gap-10">
              <div className="flex flex-col gap-5">
                <div className="relative w-[28rem] h-[28rem] border rounded-xl overflow-hidden">
                  <Image
                    src={selectedImage || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center gap-5">
                  {allImages.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-[6rem] h-[6rem] border-2 rounded-lg overflow-hidden cursor-pointer transition ${selectedImage === img ? 'border-button' : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`thumbnail ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className='w-full flex items-center gap-5'>
                  <button className='w-full bg-orange-500 rounded-full text-white font-[500] py-3 hover:bg-orange-600 transition'>
                    Shopee
                  </button>
                  <button className='w-full bg-green-500 rounded-full text-white font-[500] py-3 hover:bg-green-600 transition'>
                    Tokopedia
                  </button>
                </div>
              </div>

              <div className='w-[40rem]'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-col gap-3'>
                    <h1 className='text-2xl font-[500] max-w-[35rem]'>{product.name}</h1>
                    <div className='flex items-center gap-3'>
                      {product.discount && (
                        <span className='text-lg text-gray-400 line-through'>
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      )}
                      <p className='text-4xl font-[600] text-button'>
                        Rp {finalPrice?.toLocaleString('id-ID')}
                      </p>
                      {product.discount && (
                        <span className='bg-red-500 text-white text-sm px-2 py-1 rounded'>
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  <button onClick={toggleFavorite} className='p-3 hover:bg-gray-100 rounded-full transition'>
                    {isFavorite ? (
                      <HeartFillIcon className='w-7 h-7 text-red-500' />
                    ) : (
                      <HeartIcon className='w-7 h-7 text-gray-400' />
                    )}
                  </button>
                </div>

                <div className='w-full h-[1px] rounded-full bg-gray-200 my-8' />

                {product.variants.length > 0 && (
                  <>
                    <div className='flex flex-col gap-2'>
                      <h1 className='font-[500]'>Pilih Warna:</h1>
                      <div className='flex gap-2'>
                        {product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => selectVariant(variant)}
                            className={`px-4 py-2 border rounded-lg transition ${selectedVariant === variant.id
                              ? 'border-button bg-blue-50 text-button'
                              : 'border-gray-300 hover:border-gray-400'
                              }`}
                          >
                            {variant.color}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className='w-full h-[1px] rounded-full bg-gray-200 my-8' />
                  </>
                )}

                <div>
                  <div className='flex border-b'>
                    <button
                      onClick={() => setActiveTab('detail')}
                      className={`px-4 py-2 font-medium transition ${activeTab === 'detail'
                        ? 'border-b-2 border-button text-button'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`px-4 py-2 font-medium transition ${activeTab === 'info'
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
                <h1 className='font-[600] text-xl'>Mungkin Anda Tertarik</h1>
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
              <Link href='/user'>
                <button className='px-6 py-2 bg-button text-white rounded-full hover:opacity-90 transition'>
                  Lihat Semua Produk
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}