'use client'
import Link from 'next/link';
import api from '../../../../lib/axios';
import { useState, useEffect } from 'react';
import { getUserColor } from '@/utils/color';
import { useAuth } from '@/app/components/ui/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { BsArrowLeft as ArrowIcon } from 'react-icons/bs';
import { MessagesSquare, MessageCirclePlus, ChevronDown, ChevronUp } from 'lucide-react';

interface ForumUser {
  id: number
  username: string
}

interface ForumReply {
  id: number
  content: string
  createdAt: string
  user: ForumUser
  replies?: ForumReply[]
  parentId?: number | null
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

const countAllReplies = (replies: ForumReply[]): number => {
  let count = 0;
  for (const reply of replies) {
    count++;
    if (reply.replies && reply.replies.length > 0) {
      count += countAllReplies(reply.replies);
    }
  }
  return count;
};

interface FlatReply {
  reply: ForumReply
  depth: number
  topLevelId: number
}

interface CommentItemProps {
  item: FlatReply
  formatDate: (date: string) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  replyingTo: number | null
  setReplyingTo: (id: number | null) => void
  onSubmitReply: (content: string, parentId: number) => Promise<void>
  submitting: boolean
  extra?: React.ReactNode
}

function CommentItem({
  item,
  formatDate,
  user,
  replyingTo,
  setReplyingTo,
  onSubmitReply,
  submitting,
  extra,
  onDeleteReply
}: CommentItemProps & { onDeleteReply: (id: number) => Promise<void> }) {
  const { reply, depth } = item
  const [localReplyContent, setLocalReplyContent] = useState('')
  const isReplying = replyingTo === reply.id

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!localReplyContent.trim()) return
    const contentWithMention = `@${reply.user.username} ${localReplyContent}`
    await onSubmitReply(contentWithMention, reply.id)
    setLocalReplyContent('')
  }

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      await onDeleteReply(reply.id)
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-10' : ''}`}>
      <div className={`p-3 rounded-lg ${isReplying ? 'bg-red-50 border border-red-200' : ''} transition-colors`}>
        <div className="flex gap-3">
          <div className={`w-8 h-8 ${getUserColor(reply.user.username)} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-sm font-semibold text-black">{reply.user.username[0].toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-900">{reply.user.username}</span>
              <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-line break-words">{reply.content}</p>
            <div className="flex items-center gap-3 mt-2">
              {user && (
                <>
                  <button
                    onClick={() => setReplyingTo(isReplying ? null : reply.id)}
                    className="text-xs text-gray-500 hover:text-red-800 font-medium transition"
                  >
                    {isReplying ? 'Batal' : 'Balas'}
                  </button>

                  {user && (user.id === reply.user.id || user.isAdmin) && (
                    <button
                      onClick={handleDelete}
                      className="text-xs text-gray-500 hover:text-red-800 font-medium transition"
                    >
                      Hapus
                    </button>
                  )}
                </>
              )}
              {extra}
            </div>
          </div>
        </div>
      </div>

      {isReplying && user && (
        <form onSubmit={handleFormSubmit} className="mt-4">
          <div className="bg-gray-100 rounded-t-md p-2 border-b border-gray-200 text-xs text-gray-600">
            Membalas ke <span className="font-semibold text-gray-800">@{reply.user.username}</span>
          </div>
          <div className="flex gap-3 bg-white rounded-b-md border border-t-0 border-gray-200 p-2">
            <div className={`w-10 h-10 ${getUserColor(user.username)} rounded-full flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm font-semibold text-black">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <textarea
                value={localReplyContent}
                onChange={(e) => setLocalReplyContent(e.target.value)}
                placeholder="Ketik balasanmu..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 resize-none bg-white text-sm"
                rows={3}
                required
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-800 text-white px-4 py-1 rounded-full hover:bg-red-900 transition disabled:opacity-50 text-xs font-medium"
                >
                  {submitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}


export default function ForumDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const forumId = params?.id as string | undefined

  const [forum, setForum] = useState<ForumDetail | null>(null)
  const [mainReplyContent, setMainReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (forumId) fetchForumDetail()
  }, [forumId])

  const fetchForumDetail = async () => {
    try {
      const response = await api.get<ApiResponse<ForumDetail>>(`/forums/${forumId}`)
      setForum(response.data.data)
    } catch {
      setError('Gagal memuat forum')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReply = async (id: number) => {
    await api.delete(`/forums/replies/${id}`)
    await fetchForumDetail()
  }

  const flattenReplies = (replies: ForumReply[]): FlatReply[] => {
    const result: FlatReply[] = []
    const dfs = (r: ForumReply, depth = 0, topLevelId?: number) => {
      const currentTop = depth === 0 ? r.id : (topLevelId as number)
      result.push({ reply: r, depth, topLevelId: currentTop })
      if (r.replies && r.replies.length > 0) {
        for (const child of r.replies) {
          dfs(child, depth + 1, currentTop)
        }
      }
    }
    for (const top of replies) {
      dfs(top, 0, top.id)
    }
    return result
  }

  const handleMainReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!mainReplyContent.trim()) return
    setSubmitting(true)
    try {
      await api.post(`/forums/${forumId}/replies`, { content: mainReplyContent })
      setMainReplyContent('')
      await fetchForumDetail()
    } finally {
      setSubmitting(false)
    }
  }

  const handleNestedReply = async (content: string, parentId: number) => {
    setSubmitting(true)
    try {
      await api.post(`/forums/${forumId}/replies`, { content, parentId })
      setReplyingTo(null)
      await fetchForumDetail()
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

  const totalComments = countAllReplies(forum.replies)
  const sortedReplies = [...forum.replies].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const flat = flattenReplies(sortedReplies)

  return (
    <div className="min-h-screen mt-40">
      <section className="w-full container mx-auto px-10 flex flex-col gap-5 pb-20">
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <MessagesSquare className='w-6 h-6 text-red-800' />
            <h1 className='text-3xl font-bold text-red-800'>Detail Diskusi</h1>
          </div>
          <Link href="/user/forum" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-800 mb-6 transition">
            <ArrowIcon /> Kembali ke Forum
          </Link>
        </div>

        <div className='flex items-stretch gap-10'>
          <div className='flex-1 flex-col'>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold mb-2">{forum.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className={`w-6 h-6 ${getUserColor(forum.user.username)} rounded-full flex items-center justify-center`}>
                  <span className="text-xs font-semibold text-black">{forum.user.username[0].toUpperCase()}</span>
                </div>
                <span>{forum.user.username}</span>
                <span>•</span>
                <span>{formatDate(forum.createdAt)}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{forum.content}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Komentar ({totalComments})</h2>

              {user ? (
                <form onSubmit={handleMainReply} className="mb-6">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 ${getUserColor(user.username)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-semibold text-black">{user.username[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={mainReplyContent}
                        onChange={(e) => setMainReplyContent(e.target.value)}
                        placeholder="Tulis komentarmu di sini..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-red-800 resize-none bg-white"
                        rows={3}
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-900 transition disabled:opacity-50 text-sm font-medium"
                        >
                          {submitting ? 'Mengirim...' : 'Kirim'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center mb-6">
                  <p className="text-gray-600 mb-4">Silakan login untuk berkomentar</p>
                  <Link href="/auth/sign-in" className="text-red-800 hover:underline font-medium">Login Sekarang</Link>
                </div>
              )}
              <div>
                {flat.map((item) => {
                  if (item.depth > 0 && !expanded[item.topLevelId] && replyingTo !== item.reply.id) {
                    return null
                  }

                  const countRepliesDeep = (reply: ForumReply): number => {
                    if (!reply.replies || reply.replies.length === 0) return 0

                    let count = reply.replies.length
                    for (const child of reply.replies) {
                      count += countRepliesDeep(child)
                    }
                    return count
                  }

                  const isTop = item.depth === 0
                  const topReply = forum.replies.find(r => r.id === item.reply.id)
                  const hasChildren = Boolean(topReply && topReply.replies && topReply.replies.length > 0)
                  const childrenCount = topReply ? countRepliesDeep(topReply) : 0


                  const spacingClass = isTop ? '-mb-1' : '-mb-2'

                  return (
                    <div key={item.reply.id} className={spacingClass}>
                      <CommentItem
                        item={item}
                        formatDate={formatDate}
                        user={user}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        onSubmitReply={handleNestedReply}
                        onDeleteReply={handleDeleteReply}
                        submitting={submitting}
                        extra={
                          isTop && hasChildren ? (
                            <button
                              onClick={() =>
                                setExpanded(prev => ({
                                  ...prev,
                                  [item.reply.id]: !prev[item.reply.id]
                                }))
                              }
                              className="text-xs text-gray-600 hover:text-red-800"
                            >
                              <span className="flex items-center gap-1">
                                {expanded[item.reply.id] ? (
                                  <>
                                    Sembunyikan balasan
                                    <ChevronUp size={14} />
                                  </>
                                ) : (
                                  <>
                                    Lihat {childrenCount} balasan
                                    <ChevronDown size={14} />
                                  </>
                                )}
                              </span>

                            </button>
                          ) : null
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className='w-80'>
            <div className='border border-gray-200 rounded-xl p-6 bg-white'>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCirclePlus className='text-3xl text-red-800' />
              </div>
              <div className='text-center mb-4'>
                <h3 className='font-semibold text-[19px] text-gray-900 mb-2'>Punya Topik lain?</h3>
                <p className='text-[12px] text-gray-500'>Mulai percakapan baru kapan saja saat anda membutuhkannya.</p>
              </div>
              <Link href='/user/forumForm'>
                <button className="w-full bg-red-800 text-white text-[13px] font-medium py-3 px-6 rounded-full hover:bg-red-900 cursor-pointer transition">
                  Mulai Diskusi Baru
                </button>
              </Link>
            </div>

            <div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}