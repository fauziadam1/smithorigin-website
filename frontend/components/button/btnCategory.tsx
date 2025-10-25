'use client'
import React, { useState, useEffect } from 'react'
import { Image } from "@heroui/react";
import Link from 'next/link';
import api from '../../lib/axios'; // pastikan path ini sesuai dengan file axios-mu

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  slug?: string; // opsional kalau pakai slug untuk route
}

export function ButtonCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading categories...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className='w-full flex flex-col gap-10'>
      <h1 className='header-top-product text-center text-2xl font-[700]'>Category</h1>
      <section className='relative justify-center grid grid-flow-col auto-cols-max gap-20'>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/user/category/${cat.id}`}
            className='flex flex-col text-center gap-3 w-fit h-fit'
          >
            <Image
              isZoomed
              alt={cat.name}
              src={cat.imageUrl || '/placeholder.jpg'}
              width={180}
              height={180}
            />
            <h1 className='font-[600]'>{cat.name}</h1>
          </Link>
        ))}
      </section>
    </div>
  )
}
