'use client'
import Image from 'next/image';
import api from '../../../lib/axios';
import { useState, useEffect } from 'react';
import { useAlert } from '@/app/components/ui/Alert';
import { useConfirm } from '@/app/components/ui/Confirm';
import { Search, MoreVertical, Edit2, Trash2, Filter, Plus, X, Upload, ImagePlus, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
  _count?: {
    products: number;
  };
}

export default function CategoryPage() {
  const { showAlert } = useAlert()
  const { confirmDialog } = useConfirm()
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMakeCategoryOpen, setIsMakeCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchQuery, sortOrder]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Gagal memuat kategori');
      } else {
        setError('Gagal memuat kategori');
      }
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    let result = [...categories];

    if (searchQuery) {
      result = result.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      return sortOrder === 'newest' ? b.id - a.id : a.id - b.id;
    });

    setFilteredCategories(result);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredCategories.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredCategories.map((cat) => cat.id)));
    }
  };

  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirmDialog('Yakin ingin menghapus kategori ini?')
    if (!ok) return

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setOpenMenuId(null);
      showAlert('Kategori berhasil dihapus!');
    } catch (err: unknown) {
      const message =
        (err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined) || 'Gagal menghapus kategori';
      showAlert(message);
    }
  };

  const handleDeleteAllSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedItems.size} kategori?`)) return;

    try {
      await Promise.all(
        Array.from(selectedItems).map((id) => api.delete(`/categories/${id}`))
      );
      setCategories((prev) => prev.filter((cat) => !selectedItems.has(cat.id)));
      setSelectedItems(new Set());
      setOpenMenuId(null);
      alert('Semua kategori terpilih berhasil dihapus!');
    } catch (err: unknown) {
      const message =
        (err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined) || 'Gagal menghapus beberapa kategori';
      showAlert(message);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsMakeCategoryOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsMakeCategoryOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveCategory = async (data: { name: string; imageFile: File | null; imageUrl: string }) => {
    try {
      let finalImageUrl = data.imageUrl;

      if (data.imageFile) {
        const formData = new FormData();
        formData.append('file', data.imageFile);

        try {
          const uploadResponse = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          finalImageUrl = uploadResponse.data.url;
        } catch (uploadErr: unknown) {
          console.error('Upload error:', uploadErr);
          if (!data.imageUrl) {
            showAlert('Gagal upload gambar. Silakan gunakan URL gambar.');
            return;
          }
        }
      }

      if (editingCategory) {
        const response = await api.put(`/categories/${editingCategory.id}`, {
          name: data.name,
          imageUrl: finalImageUrl,
        });
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? response.data.data : cat))
        );
        showAlert('Kategori berhasil diupdate!');
      } else {
        const response = await api.post('/categories', {
          name: data.name,
          imageUrl: finalImageUrl,
        });
        setCategories((prev) => [response.data.data, ...prev]);
        showAlert('Kategori berhasil ditambahkan!');
      }
      setIsMakeCategoryOpen(false);
    } catch (err: unknown) {
      const message =
        (err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined) || 'Gagal menyimpan kategori';
      showAlert(message);
    }
  };

  const allSelected = selectedItems.size === filteredCategories.length && filteredCategories.length > 0;

  return (
    <div className="mx-auto p-6 relative">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
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

            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            {selectedItems.size > 0 ? (
              <button
                onClick={handleDeleteAllSelected}
                className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Terpilih ({selectedItems.size})
              </button>
            ) : (
              <button
                onClick={handleAddCategory}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-red-800 text-white text-sm font-medium rounded-lg hover:bg-red-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Category
              </button>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(category.id)}
                        onChange={() => toggleSelectItem(category.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-4 py-4">
                      {category.imageUrl ? (
                        <Image src={category.imageUrl} width={100} height={100} alt={category.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{category._count?.products || 0}</td>
                    <td className="px-4 py-4 text-right relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                        className="p-1 hover:bg-gray-100 cursor-pointer rounded transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>

                      {openMenuId === category.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {selectedItems.size > 1 ? (
                              <button
                                onClick={handleDeleteAllSelected}
                                className="w-full px-4 py-2 cursor-pointer text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Hapus {selectedItems.size} Item
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="w-full px-4 py-2 text-left cursor-pointer text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(category.id)}
                                  className="w-full px-4 py-2 text-left cursor-pointer text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isMakeCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 border border-gray-200 relative">
            <button
              onClick={() => setIsMakeCategoryOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h1 className="text-xl font-semibold mb-5 text-gray-800">
              {editingCategory ? 'Edit Category' : 'Tambah Category'}
            </h1>

            <MakeCategoryForm
              initialData={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => setIsMakeCategoryOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MakeCategoryForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Category | null;
  onSave: (data: { name: string; imageFile: File | null; imageUrl: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [preview, setPreview] = useState(initialData?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    setImageFile(file);
    setImageUrl('');
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
    setPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama category wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      await onSave({ name, imageFile, imageUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Category
        </label>
        <input
          type="text"
          placeholder="Masukkan nama category..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar Category
        </label>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-red-800'
            }`}
        >
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={100}
                height={100}
                className="w-32 h-32 mx-auto object-cover rounded-lg mb-3"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/128?text=Error';
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImageUrl('');
                  setPreview('');
                }}
                className="absolute top-0 right-1/2 translate-x-16 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-4">
              <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {isDragging ? 'Lepaskan file di sini' : 'Drag & drop gambar atau klik untuk upload'}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 5MB)</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-xs text-gray-500">ATAU</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <input
            type="url"
            placeholder="Paste URL gambar..."
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={!!imageFile}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 font-medium cursor-pointer py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center cursor-pointer gap-2 bg-red-800 hover:bg-red-900 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}