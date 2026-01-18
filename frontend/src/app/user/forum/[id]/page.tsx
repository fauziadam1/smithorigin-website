'use client'
import Link from 'next/link';
import api from '../../../../lib/axios';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserColor } from '@/utils/color';
import { useConfirm } from '@/app/components/ui/confirm';
import { BsArrowLeft as ArrowIcon } from 'react-icons/bs';
import { useAuth } from '@/app/components/ui/authcontext';
import { MessagesSquare, MessageCirclePlus, ChevronDown, ChevronUp, Clock } from 'lucide-react';

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

interface Forum {
  id: number
  title: string
  createdAt: string
  user: {
    id: number
    username: string
  }
  _count: {
    replies: number
  }
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
  const { confirmDialog } = useConfirm()

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!localReplyContent.trim()) return
    const contentWithMention = `@${reply.user.username} ${localReplyContent}`
    await onSubmitReply(contentWithMention, reply.id)
    setLocalReplyContent('')
  }

  const handleDelete = async () => {
    if (await confirmDialog('Apakah Anda yakin ingin menghapus komentar ini?')) {
      await onDeleteReply(reply.id)
    }
  }



  return (
    <div className={`${depth > 0 ? 'ml-6 md:ml-10' : ''}`}>
      <div className={`p-3 rounded-lg ${isReplying ? 'bg-red-50 border border-red-200' : ''} transition-colors`}>
        <div className="flex gap-3">
          <div className={`w-8 h-8 ${getUserColor(reply.user.username)} rounded-full flex items-center justify-center shrink-0`}>
            <span className="text-sm font-semibold text-black">{reply.user.username[0].toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-900">{reply.user.username}</span>
              <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-line wrap-break-word">{reply.content}</p>
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
                      className="text-xs cursor-pointer text-gray-500 hover:text-red-800 font-medium transition"
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
            <div className={`w-10 h-10 ${getUserColor(user.username)} rounded-full flex items-center justify-center shrink-0`}>
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
  const [otherForums, setOtherForums] = useState<Forum[]>([])
  const [mainReplyContent, setMainReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [showAllForums, setShowAllForums] = useState(false)

  useEffect(() => {
    if (forumId) {
      fetchForumDetail()
      fetchOtherForums()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchOtherForums = async () => {
    try {
      const response = await api.get<ApiResponse<Forum[]>>('/forums?limit=50')
      const filtered = response.data.data.filter((f: Forum) => f.id !== parseInt(forumId || '0'))

      const shuffled = filtered.sort(() => Math.random() - 0.5)

      setOtherForums(shuffled.slice(0, 10))
    } catch {
      console.error('Gagal memuat forum lainnya')
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

  const formatDate = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)

    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffSeconds < 60) {
      return `${diffSeconds} dtk`
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} mnt`
    }

    if (diffHours < 24) {
      return `${diffHours} j`
    }

    if (diffDays < 7) {
      return `${diffDays} h`
    }

    if (diffWeeks < 4) {
      return `${diffWeeks} m`
    }

    const sameYear = now.getFullYear() === date.getFullYear()

    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()

    if (sameYear) {
      return `${dd}-${mm}`
    }

    return `${yyyy}-${mm}-${dd}`
  }

  const formatTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 60) return `${diffMins} menit yang lalu`
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    return `${Math.floor(diffHours / 24)} hari yang lalu`
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
            Kembali
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

  const displayedForums = showAllForums ? otherForums : otherForums.slice(0, 5)

  return (
    <div className="min-h-screen mt-25 md:mt-40">
      <section className="w-full container mx-auto px-4 md:px-10 flex flex-col gap-5 pb-20">
        <div className='flex items-center justify-between py-2'>
          <div className='flex items-center gap-2 md:gap-3'>
            <MessagesSquare className='w-5 h-5 md:w-6 md:h-6 text-red-800' />
            <h1 className='text-xl md:text-3xl font-bold text-red-800'>Detail Diskusi</h1>
          </div>
          <Link href="/user/forum" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-800 transition text-sm md:text-base">
            <ArrowIcon className="w-4 h-4 md:w-5 md:h-5" /> 
            Kembali
          </Link>
        </div>

        <div className='flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10'>
          <div className='flex-1 flex-col'>
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="flex items-center bg-red-100/20 gap-2 text-sm p-4 md:p-6 border-b border-gray-200">
                <div className='flex items-center gap-3'>
                  <div className={`w-10 h-10 ${getUserColor(forum.user.username)} rounded-full flex items-center justify-center`}>
                    <span className="text-sm font-semibold text-black">{forum.user.username[0].toUpperCase()}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-bold text-sm md:text-[15px]'>{forum.user.username}</span>
                    <span className="text-xs flex items-center gap-1 text-gray-400"><Clock className='w-3 h-3' />{formatTime(forum.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className='p-4 md:p-6'>
                <h1 className="text-xl md:text-2xl font-bold mb-2">{forum.title}</h1>
                <p className="text-gray-700 whitespace-pre-line wrap-break-word">{forum.content}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Komentar ({totalComments})</h2>

              {user ? (
                <form onSubmit={handleMainReply} className="mb-6">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 ${getUserColor(user.username)} rounded-full flex items-center justify-center shrink-0`}>
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
                          className="bg-red-800 text-white px-4 md:px-6 py-2 rounded-full hover:bg-red-900 transition disabled:opacity-50 text-sm font-medium"
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
                  <Link href="/auth/login" className="text-red-800 hover:underline font-medium">Login Sekarang</Link>
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

          {/* Sidebar - Muncul di bawah pada mobile */}
          <div className='w-full lg:w-80 space-y-5'>
            <div className='border border-gray-200 rounded-xl p-4 md:p-6 bg-white'>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCirclePlus className='text-3xl text-red-800' />
              </div>
              <div className='text-center mb-4'>
                <h3 className='font-semibold text-base md:text-[19px] text-gray-900 mb-2'>Punya Topik lain?</h3>
                <p className='text-xs md:text-[12px] text-gray-500'>Mulai percakapan baru kapan saja saat anda membutuhkannya.</p>
              </div>
              <Link href='/user/forumForm'>
                <button className="w-full bg-red-800 text-white text-xs md:text-[13px] font-medium py-3 px-6 rounded-full hover:bg-red-900 cursor-pointer transition">
                  Mulai Diskusi Baru
                </button>
              </Link>
            </div>

            <div className='border border-gray-200 rounded-xl bg-white overflow-hidden'>
              <div className='bg-linear-to-r from-red-800 to-red-900 px-4 py-3'>
                <h3 className='text-white font-semibold text-sm'>Diskusi Lainnya</h3>
              </div>

              {otherForums.length === 0 ? (
                <div className='p-4 text-center text-gray-400 text-xs'>
                  Tidak ada diskusi lain
                </div>
              ) : (
                <>
                  <div className='divide-y divide-gray-100'>
                    {displayedForums.map((otherForum) => (
                      <Link
                        key={otherForum.id}
                        href={`/user/forum/${otherForum.id}`}
                        className='block hover:bg-gray-50 transition'
                      >
                        <div className='flex items-center justify-between p-4'>
                          <div className='flex items-center gap-3 flex-1 min-w-0'>
                            <div className={`w-8 h-8 ${getUserColor(otherForum.user.username)} rounded-full flex items-center justify-center shrink-0`}>
                              <span className="text-xs font-semibold text-black">
                                {otherForum.user.username[0].toUpperCase()}
                              </span>
                            </div>
                            <div className='leading-5 flex-1 min-w-0'>
                              <h4
                                title={otherForum.title}
                                className='font-medium text-sm text-gray-900 truncate hover:text-red-800 transition'
                              >
                                {otherForum.title}
                              </h4>
                              <span className='text-xs text-gray-500 font-light'>{otherForum.user.username}</span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between text-xs text-gray-500 ml-2'>
                            <div className='flex items-center gap-1.5'>
                              <MessagesSquare className='w-3.5 h-3.5' />
                              <span>{otherForum._count.replies}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {otherForums.length > 5 && (
                    <div className='p-3 border-t border-gray-100'>
                      <button
                        onClick={() => setShowAllForums(!showAllForums)}
                        className='w-full text-center text-xs cursor-pointer text-red-800 hover:text-red-900 font-medium transition'
                      >
                        {showAllForums ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${otherForums.length})`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}