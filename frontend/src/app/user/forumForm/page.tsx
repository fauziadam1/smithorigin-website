'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsArrowLeft as ArrowIcon } from 'react-icons/bs'
import { PiNotePencilDuotone as EditIcon } from 'react-icons/pi'
import { PiPaperPlaneRightFill as PlaneIcon } from 'react-icons/pi'
import { LuCircleAlert as AlertIcon } from 'react-icons/lu'
import api from '../../../../lib/axios'
import { getAuth } from '../../../../lib/auth'

export default function ForumForm() {
  const router = useRouter()
  const { user } = getAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Anda harus login terlebih dahulu untuk membuat thread.')
      setTimeout(() => router.push('/auth/sign-in'), 3000)
      return
    }

    if (!title.trim() || !content.trim()) {
      setError('Judul dan isi percakapan wajib diisi!')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.post('/forums', { title, content })

      setSuccess('Percakapan berhasil dikirim!')
      setTitle('')
      setContent('')

      console.log('Response dari server:', response.data)

      setTimeout(() => {
        router.push('/user/forum')
      }, 1000)
    } catch (err: unknown) {
      console.error('Error saat submit forum:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
      ) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response!.data!.message!
        )
      } else {
        setError('Gagal mengirim percakapan.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 my-40">
      <section className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-4">
            <EditIcon className="text-5xl text-red-800" />
            <h1 className="text-4xl font-bold">Bagikan Pendapat Anda</h1>
          </div>
          <Link href="/user/forum">
            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 hover:text-red-800 transition">
              <ArrowIcon />
              Kembali
            </button>
          </Link>
        </div>

        <div className="bg-white border rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-2">Detail Percakapan</h2>
          <p className="text-sm text-gray-500 mb-6">
            Isi detail berikut untuk memulai diskusi baru
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Judul Topik</label>
              <input
                type="text"
                placeholder="Berikan judul diskusi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <span className="text-xs text-gray-400">
                Buat judul yang singkat dan jelas.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Pendapat atau Saran Anda</label>
              <textarea
                placeholder="Tuliskan apa yang ada di benak Anda"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none h-32"
              />
              <span className="text-xs text-gray-400">
                Kritik maupun saran akan sangat membantu website ini untuk lebih berkembang dan inovatif.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 cursor-pointer bg-red-800 text-white font-medium py-2.5 px-6 rounded-full hover:bg-red-900 transition disabled:opacity-50"
              >
                <PlaneIcon className="rotate-180" />
                {loading ? 'Mengirim...' : 'Kirim Percakapan'}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <AlertIcon className="text-blue-600" />
            Ingatlah untuk bijak dalam berkomunikasi dan menjaga privasi.
          </div>
        </div>
      </section>
    </div>
  )
}
