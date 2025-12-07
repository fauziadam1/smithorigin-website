'use client'
import Image from 'next/image'
import api from '../../../lib/axios'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, X, Save, ChevronDown, Check } from 'lucide-react'
import { useAlert } from '@/app/components/ui/Alert'
import { useConfirm } from '@/app/components/ui/Confirm'

type Category = { id: number; name: string }

type ProductVariant = {
  id: number | null
  color: string
  imageUrl: string
  imagePreview: string
  imageFile: File | null
  price: string
}

type ProductResponse = {
  id: number
  name: string
  description: string
  price: number
  discount: number | null
  imageUrl: string
  categoryId: number | null
  isBestSeller: boolean
  variants?: Array<{
    id: number
    color: string
    imageUrl: string
    price?: number | null
  }>
}

export default function ProductForm() {
  const { showAlert } = useAlert()
  const { confirmDialog } = useConfirm()
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

  const [variants, setVariants] = useState<ProductVariant[]>([])

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
      const res = await api.get<{ data: Category[] }>('/categories')
      setCategories(res.data.data || [])
    } catch (err: unknown) {
      console.error('fetchCategories error', err)
    }
  }

  const fetchProduct = async (id: number) => {
    try {
      const res = await api.get<{ data: ProductResponse }>(`/products/${id}`)
      const p = res.data.data
      setName(p.name)
      setDescription(p.description)
      setPrice(String(p.price))
      setDiscount(p.discount ? String(p.discount) : '')
      setCategoryId(p.categoryId ? String(p.categoryId) : '')
      setMainImageUrl(p.imageUrl || '')
      setMainImagePreview(p.imageUrl || '')
      setIsBestSeller(Boolean(p.isBestSeller))

      if (p.variants?.length) {
        setEnableVariant(true)
        const loadedVariants: ProductVariant[] = p.variants.map((v) => ({
          id: v.id,
          color: v.color,
          imageUrl: v.imageUrl,
          imagePreview: v.imageUrl,
          imageFile: null,
          price: v.price ? String(v.price) : '',
        }))
        setVariants(loadedVariants)
      }
    } catch (err) {
      console.error('fetchProduct error', err)
      showAlert('Gagal memuat produk')
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post<{ url: string }>('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.url
  }

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | File | null
  ) => {
    setVariants((prev) => {
      const newVariants = [...prev]
      const current = { ...newVariants[index] }

      if (field === 'imageFile' && value instanceof File) {
        current.imageFile = value
        current.imagePreview = URL.createObjectURL(value)
      } else if (field === 'color' && typeof value === 'string') {
        current.color = value
      } else if (field === 'imageUrl' && typeof value === 'string') {
        current.imageUrl = value
        current.imageFile = null
        current.imagePreview = value
      } else if (field === 'price' && typeof value === 'string') {
        current.price = value
      }

      newVariants[index] = current
      return newVariants
    })
  }

  const handleAddVariant = () => {
    if (variants.length >= 5) {
      showAlert('Maksimal 5 varian produk.')
      return
    }
    setVariants((v) => [
      ...v,
      { id: null, color: '', imageUrl: '', imagePreview: '', imageFile: null, price: '' },
    ])
  }

  const handleRemoveVariant = async (index: number) => {
    const variantToRemove = variants[index]
    if (isEditMode && variantToRemove.id) {
      const isConfirmed = confirm('Yakin ingin menghapus varian ini?')
      if (!isConfirmed) return

      try {
        await api.delete(`/products/${productIdParam}/variants/${variantToRemove.id}`)
        showAlert('Varian berhasil dihapus dari database.')
      } catch (err) {
        console.error('Gagal menghapus varian', err)
        showAlert('Gagal menghapus varian.')
        return
      }
    }
    setVariants((v) => v.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim() || !price || (!mainImageFile && !mainImageUrl)) {
      showAlert('Nama, harga, dan gambar utama wajib diisi.')
      return
    }

    setLoading(true)
    try {
      let mainUrl = mainImageUrl
      if (mainImageFile) mainUrl = await uploadImage(mainImageFile)

      const payload = {
        name,
        description,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : null,
        imageUrl: mainUrl,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        isBestSeller,
      }

      const res = isEditMode
        ? await api.put<{ data: ProductResponse }>(`/products/${productIdParam}`, payload)
        : await api.post<{ data: ProductResponse }>('/products', payload)

      const savedProduct = res.data.data

      if (enableVariant) {
        for (const variant of variants) {
          if (!variant.color.trim() && !variant.imageFile && !variant.imageUrl) continue

          let variantImageUrl = variant.imageUrl
          if (variant.imageFile) variantImageUrl = await uploadImage(variant.imageFile)

          const variantPayload = {
            color: variant.color,
            imageUrl: variantImageUrl,
            price: variant.price ? parseFloat(variant.price) : undefined,
          }

          if (variant.id) {
            await api.put(`/variants/${variant.id}`, variantPayload)
          } else {
            await api.post(`/products/${savedProduct.id}/variants`, variantPayload)
          }
        }
      }

      showAlert(isEditMode ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!')
      router.push('/admin/product')
    } catch (err) {
      console.error('submit error', err)
      showAlert('Gagal menyimpan produk sesi anda telah berakhir')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMainImage = () => {
    if (mainImageFile) URL.revokeObjectURL(mainImagePreview)
    setMainImageFile(null)
    setMainImageUrl('')
    setMainImagePreview('')
  }

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold">{isEditMode ? 'Edit Produk' : 'Tambah Produk'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Nama Produk</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Harga (IDR)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Deskripsi</label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Diskon (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div ref={categoryRef} className="relative">
              <label className="block text-sm mb-1 font-medium">Kategori</label>
              <button
                type="button"
                onClick={() => setCategoryOpen((o) => !o)}
                className="w-full flex justify-between items-center border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categoryId
                  ? categories.find((c) => c.id === parseInt(categoryId))?.name || 'Pilih Kategori'
                  : 'Pilih Kategori'}
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>

              {categoryOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="max-h-40 overflow-y-auto">
                    {categories.length ? (
                      categories.map((cat) => (
                        <li
                          key={cat.id}
                          onClick={() => {
                            setCategoryId(String(cat.id))
                            setCategoryOpen(false)
                          }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex justify-between items-center ${categoryId === String(cat.id)
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

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <label className="text-sm font-medium">Tandai sebagai Best Seller</label>
            <div
              onClick={() => setIsBestSeller((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${isBestSeller ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${isBestSeller ? 'translate-x-6' : 'translate-x-0'
                  }`}
              />
            </div>
          </div>

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
                  onClick={handleRemoveMainImage}
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
              <label className="block text-sm mb-2 font-medium">Gambar & Harga Varian (maks 5)</label>
              <div className="flex flex-wrap gap-4">
                {variants.map((variant, i) => (
                  <div key={variant.id || i} className="relative w-28">
                    {variant.imagePreview ? (
                      <>
                        <Image
                          src={variant.imagePreview}
                          alt={`variant-${i}`}
                          width={96}
                          height={96}
                          className="rounded-md object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(i)}
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
                              handleVariantChange(i, 'imageFile', file)
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                    <input
                      type="text"
                      placeholder="Nama varian"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                      className="mt-2 w-full text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-blue-400"
                    />
                    <input
                      type="number"
                      placeholder="Harga varian"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                      className="mt-1 w-full text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                ))}
                {variants.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-blue-400"
                  >
                    Tambah
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Save className="w-4 h-4" /> {isEditMode ? 'Update Produk' : 'Simpan Produk'}
          </button>
        </form>
      </div>
    </div>
  )
}