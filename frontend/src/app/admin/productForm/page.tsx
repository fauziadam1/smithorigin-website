'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Upload, X, Save, ChevronDown, Check } from 'lucide-react'
import api from '../../../../lib/axios'

type Category = { id: number; name: string }

export default function ProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productIdParam = searchParams?.get('id')
  const isEditMode = Boolean(productIdParam)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [enableVariant, setEnableVariant] = useState(false)
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [loading, setLoading] = useState(false)

  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImageUrl, setMainImageUrl] = useState('')
  const [mainImagePreview, setMainImagePreview] = useState('')

  const [variants, setVariants] = useState<string[]>([])
  const [variantImageFiles, setVariantImageFiles] = useState<(File | null)[]>([])
  const [variantImageUrls, setVariantImageUrls] = useState<string[]>([])
  const [variantImagePreviews, setVariantImagePreviews] = useState<string[]>([])

  const categoryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchCategories()
    if (isEditMode && productIdParam) fetchProduct(parseInt(productIdParam, 10))
  }, [productIdParam])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data.data || [])
    } catch (err) {
      console.error('fetchCategories error', err)
    }
  }

  const fetchProduct = async (id: number) => {
    try {
      const res = await api.get(`/products/${id}`)
      const p = res.data.data
      setName(p.name)
      setDescription(p.description)
      setPrice(String(p.price))
      setDiscount(String(p.discount || ''))
      setCategoryId(String(p.categoryId || ''))
      setMainImageUrl(p.imageUrl || '')
      setMainImagePreview(p.imageUrl || '')
      setIsBestSeller(p.isBestSeller || false)
      if (p.variants?.length) {
        setEnableVariant(true)
        setVariants(p.variants.map((v: any) => v.color))
        setVariantImageUrls(p.variants.map((v: any) => v.imageUrl))
        setVariantImagePreviews(p.variants.map((v: any) => v.imageUrl))
        setVariantImageFiles(Array(p.variants.length).fill(null))
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal memuat produk')
      router.push('/admin/product')
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || (!mainImageFile && !mainImageUrl)) {
      alert('Pastikan semua field wajib diisi.')
      return
    }

    setLoading(true)
    try {
      let mainUrl = mainImageUrl
      if (mainImageFile) mainUrl = await uploadImage(mainImageFile)

      const payload: any = {
        name,
        description,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : null,
        imageUrl: mainUrl,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        isBestSeller,
      }

      let saved
      if (isEditMode) saved = (await api.put(`/products/${productIdParam}`, payload)).data.data
      else saved = (await api.post('/products', payload)).data.data

      if (enableVariant && variants.length) {
        for (let i = 0; i < variants.length; i++) {
          let imageUrl = variantImageUrls[i] ?? ''
          if (variantImageFiles[i]) imageUrl = await uploadImage(variantImageFiles[i]!)
          await api.post(`/products/${saved.id}/variants`, {
            color: variants[i],
            imageUrl,
          })
        }
      }

      alert(isEditMode ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!')
      router.push('/admin/product')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <h2 className="text-lg font-semibold">{isEditMode ? 'Edit Produk' : 'Tambah Produk'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Nama Produk</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Harga (IDR)</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium">Deskripsi</label>
            <textarea
              rows={4}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Discount + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Diskon (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            {/* Custom Category Select */}
            <div ref={categoryRef} className="relative">
              <label className="block text-sm mb-1 font-medium">Kategori</label>
              <button
                type="button"
                onClick={() => setCategoryOpen((o) => !o)}
                className="w-full flex justify-between items-center border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categoryId
                  ? categories.find((c) => c.id === parseInt(categoryId))?.name || 'Pilih Kategori'
                  : 'Pilih Kategori'}
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>

              {categoryOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg">
                  <ul className="max-h-40 overflow-y-auto">
                    {categories.length ? (
                      categories.map((cat) => (
                        <li
                          key={cat.id}
                          onClick={() => {
                            setCategoryId(String(cat.id))
                            setCategoryOpen(false)
                          }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex justify-between items-center ${
                            categoryId === String(cat.id)
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : ''
                          }`}
                        >
                          {cat.name}
                          {categoryId === String(cat.id) && <Check className="w-4 h-4" />}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-sm text-gray-500">Tidak ada kategori</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Best Seller Switch */}
          <div className="flex items-center justify-between border-t pt-4">
            <label className="text-sm font-medium">Tandai sebagai Best Seller</label>
            <div
              onClick={() => setIsBestSeller((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                isBestSeller ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  isBestSeller ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Main image upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Gambar Utama Produk *</label>
            {mainImagePreview ? (
              <div className="relative inline-block">
                <Image
                  src={mainImagePreview}
                  alt="Main"
                  width={160}
                  height={160}
                  className="rounded-md object-cover border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImageFile(null)
                    setMainImageUrl('')
                    setMainImagePreview('')
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -translate-y-1/2 translate-x-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-36 h-36 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setMainImageFile(file)
                      setMainImagePreview(URL.createObjectURL(file))
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Variant Section */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableVariant}
              onChange={(e) => setEnableVariant(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm">Aktifkan varian produk</label>
          </div>

          {enableVariant && (
            <div className="border-t pt-4">
              <label className="block text-sm mb-2 font-medium">Gambar Varian (maks 5)</label>
              <div className="flex flex-wrap gap-4">
                {variantImagePreviews.map((p, i) => (
                  <div key={i} className="relative w-24">
                    {p ? (
                      <>
                        <Image
                          src={p}
                          alt={`variant-${i}`}
                          width={96}
                          height={96}
                          className="rounded-md object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVariantImageFiles((v) => v.filter((_, idx) => idx !== i))
                            setVariantImageUrls((v) => v.filter((_, idx) => idx !== i))
                            setVariantImagePreviews((v) => v.filter((_, idx) => idx !== i))
                            setVariants((v) => v.filter((_, idx) => idx !== i))
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -translate-y-1/2 translate-x-1/2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-xs mt-1">Tambah</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setVariantImageFiles((prev) => {
                                const copy = [...prev]
                                copy[i] = file
                                return copy
                              })
                              setVariantImagePreviews((prev) => {
                                const copy = [...prev]
                                copy[i] = URL.createObjectURL(file)
                                return copy
                              })
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                    <input
                      type="text"
                      placeholder="Nama varian"
                      value={variants[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setVariants((prev) => {
                          const copy = [...prev]
                          copy[i] = val
                          return copy
                        })
                      }}
                      className="mt-2 w-full text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                ))}
                {variantImageFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setVariantImageFiles((v) => [...v, null])
                      setVariantImageUrls((v) => [...v, ''])
                      setVariantImagePreviews((v) => [...v, ''])
                      setVariants((v) => [...v, ''])
                    }}
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 text-sm text-gray-600"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs mt-1">Tambah</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/product')}
              className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
