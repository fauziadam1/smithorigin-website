'use client';
import { useState } from 'react';
import { Upload, ImagePlus, Save } from 'lucide-react';

export default function MakeCategory() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Judul category wajib diisi!');
      return;
    }
    console.log({
      title,
      image,
    });
    alert('Category berhasil dibuat (dummy)');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Tambah Category
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Category
            </label>
            <input
              type="text"
              placeholder="Masukkan nama category..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Gambar
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <ImagePlus className="w-10 h-10 text-gray-400 mb-2" />
              )}
              <label
                htmlFor="file-upload"
                className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-4 h-4" />
                Pilih Gambar
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Simpan Category
          </button>
        </form>
      </div>
    </div>
  );
}
