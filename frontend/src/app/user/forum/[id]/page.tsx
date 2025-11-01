'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BsArrowLeft as ArrowIcon } from 'react-icons/bs';
import { BiUser as UserIcon } from 'react-icons/bi';
import Link from 'next/link';
import api from '../../../../../lib/axios';
import { getAuth } from '../../../../../lib/auth';

interface ForumUser {
  id: number
  username: string
}

interface ForumReply {
  id: number
  content: string
  createdAt: string
  user: ForumUser
}

interface ForumDetail {
  id: number
  title: string
  content: string
  createdAt: string
  user: ForumUser
  replies: ForumReply[]
}

interface ApiResponse<T> {
  data: T
}

export default function ForumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const forumId = params?.id as string | undefined
  const { user } = getAuth()

  const [forum, setForum] = useState<ForumDetail | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (forumId) fetchForumDetail()
  }, [forumId])

  const fetchForumDetail = async () => {
    try {
      const response = await api.get<ApiResponse<ForumDetail>>(`/forums/${forumId}`)
      setForum(response.data.data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const apiError = err as { response?: { data?: { message?: string } } }
        setError(apiError.response?.data?.message || 'Gagal memuat forum')
      } else {
        setError('Gagal memuat forum')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setSubmitting(true)
    try {
      await api.post(`/forums/${forumId}/replies`, { content: replyContent })
      setReplyContent('')
      await fetchForumDetail()
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message)
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const apiError = err as { response?: { data?: { message?: string } } }
        alert(apiError.response?.data?.message || 'Gagal mengirim balasan')
      } else {
        alert('Gagal mengirim balasan')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error || !forum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Forum tidak ditemukan'}</p>
          <Link href="/user/forum" className="text-red-800 hover:underline">
            Kembali ke Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-fit bg-gray-50 py-40">
      <div className="container mx-auto px-10 max-w-4xl">
        <Link href="/user/forum" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-800 mb-6 transition">
          <ArrowIcon /> Kembali ke Forum
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{forum.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <UserIcon className="w-4 h-4" />
            <span>{forum.user.username}</span>
            <span>•</span>
            <span>{formatDate(forum.createdAt)}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{forum.content}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{forum.replies.length} Balasan</h2>
          <div className="space-y-4">
            {forum.replies.map((reply) => (
              <div key={reply.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium text-gray-700">{reply.user.username}</span>
                  <span>•</span>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>

        {user ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Tulis Balasan</h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Tulis balasan Anda..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-button resize-none"
                rows={4}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-800 cursor-pointer text-white px-6 py-2 rounded-full hover:bg-red-900 transition disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Balasan'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl border p-6 text-center">
            <p className="text-gray-600 mb-4">Silakan login untuk membalas diskusi</p>
            <Link href="/auth/sign-in" className="text-button hover:underline font-medium">
              Login Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}