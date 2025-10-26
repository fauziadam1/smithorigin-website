'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineHeart as HeartIcon, AiFillHeart as HeartFillIcon } from 'react-icons/ai';
import api from '../../../../../lib/axios';
import { getAuth } from '../../../../../lib/auth';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  } | null;
  variants: Array<{
    id: number;
    color: string;
    imageUrl: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const { user } = getAuth();

  const [product, setProduct] = useState<Product | null>(null);
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
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      const data = response.data.data;
      setProduct(data);
      setSelectedImage(data.imageUrl || '');
    } catch (err: any) {
      console.error(err);
      alert('Gagal memuat produk');
      router.push('/user');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get('/favorites');
      const favorites = response.data.data;
      setIsFavorite(favorites.some((fav: any) => fav.productId === parseInt(productId as string)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      router.push('/auth/sign-in');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${productId}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { productId: parseInt(productId as string) });
        setIsFavorite(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah favorit');
    }
  };

  const selectVariant = (variant: any) => {
    setSelectedVariant(variant.id);
    setSelectedImage(variant.imageUrl || product?.imageUrl || '');
  };

  const finalPrice = product?.discount
    ? product.price - (product.price * product.discount) / 100
    : product?.price;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan</div>;
  }

  const allImages = [
    product.imageUrl,
    ...product.variants.map(v => v.imageUrl).filter(Boolean)
  ].filter(Boolean) as string[];

  return (
    <div>
      <section className="container px-10 py-40 mx-auto h-fit flex items-start justify-center">
        <div className='flex flex-col items-center gap-25'>
          <div className="flex flex-col items-center gap-5">
            {/* Breadcrumb */}
            <div className="w-full text-sm text-gray-600">
              <Link href="/" className="hover:text-button">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/user/products" className="hover:text-button">Products</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>

            <div className="w-full flex items-start gap-10">
              {/* Images */}
              <div className="flex flex-col gap-5">
                <div className="relative w-[28rem] h-[28rem] border rounded-xl overflow-hidden">
                  <Image
                    src={selectedImage || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-5">
                  {allImages.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-[6rem] h-[6rem] border-2 rounded-lg overflow-hidden cursor-pointer transition ${
                        selectedImage === img ? 'border-button' : 'border-gray-200 hover:border-gray-400'
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

                {/* External Links */}
                <div className='w-full flex items-center gap-5'>
                  <button className='w-full bg-orange-500 rounded-full text-white font-[500] py-3 hover:bg-orange-600 transition'>
                    Shopee
                  </button>
                  <button className='w-full bg-green-500 rounded-full text-white font-[500] py-3 hover:bg-green-600 transition'>
                    Tokopedia
                  </button>
                </div>
              </div>

              {/* Product Info */}
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

                  {/* Favorite Button */}
                  <button onClick={toggleFavorite} className='p-3 hover:bg-gray-100 rounded-full transition'>
                    {isFavorite ? (
                      <HeartFillIcon className='w-7 h-7 text-red-500' />
                    ) : (
                      <HeartIcon className='w-7 h-7 text-gray-400' />
                    )}
                  </button>
                </div>

                <div className='w-full h-[1px] rounded-full bg-gray-200 my-8' />

                {/* Variants */}
                {product.variants.length > 0 && (
                  <>
                    <div className='flex flex-col gap-2'>
                      <h1 className='font-[500]'>Pilih Warna:</h1>
                      <div className='flex gap-2'>
                        {product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => selectVariant(variant)}
                            className={`px-4 py-2 border rounded-lg transition ${
                              selectedVariant === variant.id
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

                {/* Tabs */}
                <div>
                  <div className='flex border-b'>
                    <button
                      onClick={() => setActiveTab('detail')}
                      className={`px-4 py-2 font-medium transition ${
                        activeTab === 'detail'
                          ? 'border-b-2 border-button text-button'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`px-4 py-2 font-medium transition ${
                        activeTab === 'info'
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

          {/* Related Products */}
          <div className='w-full flex flex-col gap-5 mt-10'>
            <h1 className='font-[600] text-lg'>Mungkin anda tertarik</h1>
            <div className='text-gray-500'>Related products akan muncul di sini</div>
          </div>
        </div>
      </section>
    </div>
  );
}