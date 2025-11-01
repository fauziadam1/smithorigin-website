'use client';
import Image from 'next/image';
import api from '../../../../lib/axios';
import { useState, useEffect } from 'react';
import { useAlert } from '@/app/components/alert/alert_context';
import { useConfirm } from '@/app/components/alert/confirm_context';
import { Search, Filter, Trash2, Plus, MoreVertical, X, Save, ImagePlus } from 'lucide-react';

interface Banner {
  id: number;
  imageUrl: string;
  createdAt?: string;
}

export default function BannerPage() {
  const { showAlert } = useAlert()
  const { confirmDialog } = useConfirm()
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMakeBannerOpen, setIsMakeBannerOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    filterAndSortBanners();
  }, [banners, searchQuery, sortOrder]);

  const fetchBanners = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/banners');
      setBanners(res.data.data);
    } catch (err: unknown) {
      console.error(err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Gagal memuat banner');
      } else {
        setError('Gagal memuat banner');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortBanners = () => {
    let result = [...banners];
    if (searchQuery) {
      result = result.filter((b) =>
        b.imageUrl.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    result.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return sortOrder === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    setFilteredBanners(result);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredBanners.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredBanners.map((b) => b.id)));
    }
  };

  const toggleSelectItem = (id: number) => {
    const newSet = new Set(selectedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedItems(newSet);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirmDialog('Yakin ingin menghapus banner ini?')
    if (!ok) return

    try {
      await api.delete(`/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      setOpenMenuId(null);
      showAlert('Banner berhasil dihapus!');
    } catch (err: unknown) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message || 'Gagal menghapus banner'
          : 'Gagal menghapus banner';
      showAlert(message);
    }
  };

  const handleDeleteAllSelected = async () => {
    if (selectedItems.size === 0) return;
    const ok = await confirmDialog(`Yakin ingin menghapus ${selectedItems.size} banner?`)
    if (!ok) return

    try {
      await Promise.all(
        Array.from(selectedItems).map((id) => api.delete(`/banners/${id}`))
      );
      setBanners((prev) => prev.filter((b) => !selectedItems.has(b.id)));
      setSelectedItems(new Set());
      setOpenMenuId(null);
      showAlert('Semua banner terpilih berhasil dihapus!');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message || 'Gagal menghapus beberapa banner'
          : 'Gagal menghapus beberapa banner';
      showAlert(message);
    }
  };

  const handleSaveBanner = async (file: File | null, url: string) => {
    if (!file && !url) {
      showAlert('Gambar wajib diisi!');
      return;
    }

    try {
      let finalImageUrl = url;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalImageUrl = uploadRes.data.url;
      }

      const res = await api.post('/banners', { imageUrl: finalImageUrl });
      setBanners((prev) => [res.data.data, ...prev]);
      showAlert('Banner berhasil ditambahkan!');
      setIsMakeBannerOpen(false);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message || 'Gagal menambahkan banner'
          : 'Gagal menambahkan banner';
      showAlert(message);
    }
  };

  const allSelected =
    selectedItems.size === filteredBanners.length && filteredBanners.length > 0;

  return (
    <div className="mx-auto p-6 relative">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                placeholder="Cari banner..."
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
              <button
                onClick={() => setIsMakeBannerOpen(true)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Banner
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Ditambahkan
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada banner
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(banner.id)}
                        onChange={() => toggleSelectItem(banner.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Image
                        src={banner.imageUrl}
                        alt="Banner"
                        width={160}
                        height={96}
                        className="w-40 h-24 rounded-lg object-cover border"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {banner.createdAt
                        ? new Date(banner.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                        : '-'}
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === banner.id ? null : banner.id)
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>

                      {openMenuId === banner.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </button>
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

      {isMakeBannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 border border-gray-200 relative">
            <button
              onClick={() => setIsMakeBannerOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h1 className="text-xl font-semibold mb-5 text-gray-800">
              Tambah Banner
            </h1>

            <MakeBannerForm
              onSave={handleSaveBanner}
              onCancel={() => setIsMakeBannerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MakeBannerForm({
  onSave,
  onCancel,
}: {
  onSave: (file: File | null, url: string) => void;
  onCancel: () => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert()

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showAlert('File harus berupa gambar!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Ukuran file maksimal 5MB!');
      return;
    }
    setImageFile(file);
    setImageUrl('');
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(imageFile, imageUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Gambar Banner
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
            }`}
        >
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={150}
                height={100}
                className="w-40 h-28 mx-auto object-cover rounded-lg mb-3"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview('');
                  setImageFile(null);
                  setImageUrl('');
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
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
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null);
              setPreview(e.target.value);
            }}
            disabled={!!imageFile}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 cursor-pointer text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}