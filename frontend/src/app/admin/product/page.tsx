'use client'
import Link from 'next/link'
import Image from 'next/image'
import { AxiosError } from 'axios'
import api from '../../../../lib/axios'
import { useState, useEffect } from 'react'
import { useAlert } from '@/app/components/alert/alert_context'
import { useConfirm } from '@/app/components/alert/confirm_context'
import { Search, MoreVertical, Edit2, Trash2, Filter, Plus } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  price: number
  discount: number | null
  imageUrl: string | null
  categoryId: number | null
  isBestSeller: boolean
  category: {
    id: number
    name: string
  } | null
  variants: Array<{
    id: number
    color: string
    imageUrl: string | null
  }>
  createdAt: string
}

export default function ProductPage() {
  const { showAlert } = useAlert()
  const { confirmDialog } = useConfirm()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])



  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchQuery, sortOrder])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await api.get<{ data: Product[] }>('/products?limit=100')
      setProducts(response.data.data)
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      setError(error.response?.data?.message || 'Gagal memuat produk')
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let result = [...products]

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    result.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    setFilteredProducts(result)
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredProducts.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems)
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
    setSelectedItems(newSelected)
  }

  const handleDelete = async (id: number) => {
    const ok = await confirmDialog('Yakin ingin menghapus produk ini?')
    if (!ok) return
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setOpenMenuId(null)
      showAlert('Produk berhasil dihapus!')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      showAlert(error.response?.data?.message || 'Gagal menghapus produk')
    }
  }

  const handleDeleteAllSelected = async () => {
    if (selectedItems.size === 0) return
    const ok = await confirmDialog(`Yakin ingin menghapus ${selectedItems.size} produk ini?`)
    if (!ok) return

    try {
      await Promise.all(
        Array.from(selectedItems).map((id) => api.delete(`/products/${id}`))
      )
      setProducts((prev) => prev.filter((p) => !selectedItems.has(p.id)))
      setSelectedItems(new Set())
      setOpenMenuId(null)
      showAlert('Produk berhasil dihapus!')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      showAlert(error.response?.data?.message || 'Gagal menghapus produk')
    }
  }

  const calculateFinalPrice = (price: number, discount: number | null) => {
    if (!discount) return price
    return price - (price * discount) / 100
  }

  const allSelected =
    selectedItems.size === filteredProducts.length &&
    filteredProducts.length > 0

  return (
    <div className="mx-auto p-6 relative">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() =>
                  setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
                }
                className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
                </span>
              </button>
            </div>

            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {selectedItems.size > 0 ? (
              <button
                onClick={handleDeleteAllSelected}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Terpilih ({selectedItems.size})
              </button>
            ) : (
              <Link href="/admin/productForm">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white cursor-pointer text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Tambah Produk
                </button>
              </Link>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="relative">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Best Seller
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const finalPrice = calculateFinalPrice(product.price, product.discount)

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(product.id)}
                          onChange={() => toggleSelectItem(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {product.name}
                      </td>

                      <td className="px-4 py-4">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <div className="flex flex-col">
                          {product.discount ? (
                            <>
                              <span className="text-gray-400 line-through text-xs">
                                Rp {product.price.toLocaleString('id-ID')}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                Rp {finalPrice.toLocaleString('id-ID')}
                              </span>
                              <span className="text-xs text-red-500 font-medium">
                                -{product.discount}%
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-900 font-semibold">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {product.variants?.length || 0}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {product.category?.name || '-'}
                      </td>

                      <td className="px-4 py-4">
                        {product.isBestSeller && (
                          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                            ⭐ Best
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === product.id ? null : product.id)
                          }
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>

                        {openMenuId === product.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              {selectedItems.size > 1 ? (
                                <button
                                  onClick={handleDeleteAllSelected}
                                  className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Hapus {selectedItems.size} Item
                                </button>
                              ) : (
                                <>
                                  <Link
                                    href={`/admin/productForm?id=${product.id}`}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
