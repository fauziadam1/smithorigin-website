'use client'
import Link from 'next/link'
import api from '../../../lib/axios'
import { useRouter } from 'next/navigation'
import { BiMessageRounded } from 'react-icons/bi'
import React, { useState, useEffect } from 'react'
import { getUserColor } from '../../../utils/color'
import { useAlert } from '@/app/components/ui/Alert'
import { useConfirm } from '@/app/components/ui/Confirm'
import { useAuth } from '@/app/components/ui/AuthContext'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { Info, MessageCircleMore, MessageCirclePlus, Clock } from 'lucide-react'

interface Forum {
    id: number
    title: string
    content: string
    createdAt: string
    user: {
        id: number
        username: string
    }
    _count: {
        replies: number
        likes: number
    }
    likes: Array<{ userId: number }>
}

function ForumSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />

                <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-3 bg-gray-200 rounded" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="ml-14 space-y-2">
                <div className="w-full h-3 bg-gray-200 rounded" />
                <div className="w-2/3 h-3 bg-gray-200 rounded" />
            </div>

            <div className="ml-14 flex items-center gap-4 mt-4">
                <div className="w-14 h-4 bg-gray-200 rounded" />
                <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
        </div>
    )
}


export default function ForumPage() {
    const { showAlert } = useAlert()
    const { confirmDialog } = useConfirm()
    const router = useRouter()
    const [forums, setForums] = useState<Forum[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [openMenuId, setOpenMenuId] = useState<number | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        fetchForums()
    }, [])

    const getErrorMessage = (err: unknown): string => {
        if (typeof err === 'object' && err !== null) {
            const maybeErr = err as { response?: { data?: { message?: string } }; message?: string }
            return maybeErr.response?.data?.message || maybeErr.message || 'Terjadi kesalahan tak dikenal'
        }
        if (typeof err === 'string') return err
        return 'Terjadi kesalahan tak dikenal'
    }

    const fetchForums = async () => {
        try {
            const response = await api.get('/forums?limit=20')
            setForums(response.data.data)
        } catch (err: unknown) {
            setError(getErrorMessage(err) || 'Gagal memuat forum')
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async (forumId: number) => {
        if (!user) {
            showAlert('Silakan login terlebih dahulu')
            setTimeout(() => router.push('/auth/sign-in'), 3000)
            return
        }

        try {
            const res = await api.post(`/forums/${forumId}/like`)
            const { liked, likeCount } = res.data.data

            setForums(prev =>
                prev.map(forum => {
                    if (forum.id === forumId) {
                        return {
                            ...forum,
                            likes: liked
                                ? [...(forum.likes ?? []), { userId: user.id }]
                                : (forum.likes ?? []).filter(like => like.userId !== user.id),
                            _count: { ...forum._count, likes: likeCount },
                        }
                    }
                    return forum
                }),
            )
        } catch (err: unknown) {
            showAlert(getErrorMessage(err) || 'Gagal like forum')
        }
    }

    const handleDelete = async (forumId: number) => {
        const ok = await confirmDialog('Yakin ingin menghapus thread ini?')
        if (!ok) return

        try {
            await api.delete(`/forums/${forumId}`)
            setForums(prev => prev.filter(f => f.id !== forumId))
        } catch (err: unknown) {
            showAlert(getErrorMessage(err) || 'Gagal menghapus thread')
        }
    }

    const handleReport = (forumId: number) => {
        showAlert(`Melaporkan thread ID: ${forumId}`)
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

    return (
        <div className="min-h-screen mt-40">
            <section className='w-full container mx-auto px-10 flex flex-col gap-10'>
                <div className='flex flex-col gap-3'>
                    <div className='space-y-3'>
                        <div className="flex items-center gap-4">
                            <MessageCircleMore className='w-10 h-10 text-red-800' />
                            <h1 className='text-4xl font-bold'>Forum Komunitas Smith Origin</h1>
                        </div>
                        <div className='space-y-2'>
                            <p className='text-[13px] text-gray-600'>Platform untuk terhubung dan berbagi pengalaman</p>
                        </div>
                    </div>
                </div>

                <div className='flex items-stretch gap-10'>
                    <div className='flex-1 flex flex-col gap-5'>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Diskusi terbaru</h2>
                            <p className="text-sm text-gray-500">{forums.length} Diskusi aktif</p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col gap-5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <ForumSkeleton key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-500">{error}</div>
                        ) : forums.length === 0 ? (
                            <div className="flex items-center justify-center mt-50">
                                <div className="text-center text-gray-500">
                                    <h1 className='font-medium'>Belum ada diskusi</h1>
                                    <p className='text-xs'>Jadilah yang pertama</p>
                                </div>
                            </div>
                        ) : (
                            forums.map((forum) => {
                                const isLiked = user ? forum.likes?.some(like => like.userId === user.id) ?? false : false;
                                const isOwner = user?.id === forum.user.id;
                                const isMenuOpen = openMenuId === forum.id;

                                return (
                                    <div key={forum.id} className='bg-white border border-gray-200 rounded-xl hover:shadow-md transition relative'>
                                        <Link href={`/user/forum/${forum.id}`} className='flex items-start gap-4'>
                                            <div className="flex-1 flex items-start gap-4 border-b border-gray-200 p-5 bg-red-100/20">
                                                <div className={`w-10 h-10 ${getUserColor(forum.user.username)} rounded-full flex items-center justify-center`}>
                                                    <span className="text-sm font-semibold">{forum.user.username[0].toUpperCase()}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-sm">{forum.user.username}</span>
                                                    <span className="text-xs flex items-center gap-1 text-gray-400"><Clock className='w-3 h-3' />{formatTime(forum.createdAt)}</span>
                                                </div>
                                            </div>

                                        </Link>
                                        {/* <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(isMenuOpen ? null : forum.id)}
                                                className="p-1 hover:bg-gray-200 cursor-pointer rounded-full"
                                            >
                                                <FiMoreVertical className="w-5 h-5" />
                                            </button>

                                            {isMenuOpen && (
                                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    {isOwner && (
                                                        <button
                                                            onClick={() => { handleDelete(forum.id); setOpenMenuId(null); }}
                                                            className="w-full text-left cursor-pointer px-3 py-2 hover:bg-red-100 text-red-500"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { handleReport(forum.id); setOpenMenuId(null); }}
                                                        className="w-full text-left cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Laporkan
                                                    </button>
                                                </div>
                                            )}
                                        </div> */}

                                        <div className='border-b border-gray-200 p-5 flex flex-col gap-2'>
                                            <h3 className='text-xl font-semibold text-gray-900 hover:text-red-800 transition cursor-pointer'>
                                                {forum.title}
                                            </h3>
                                            <p className='text-sm text-gray-600 line-clamp-2'>
                                                {forum.content}
                                            </p>
                                        </div>

                                        <div className='flex items-center gap-4 p-5 text-sm text-gray-500'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleLike(forum.id)
                                                }}
                                                className={`flex items-center gap-1 cursor-pointer hover:text-red-800 transition ${isLiked ? 'text-red-800' : ''}`}
                                            >
                                                {isLiked ? <AiFillHeart className="w-5 h-5" /> : <AiOutlineHeart className="w-5 h-5" />}
                                                <span className="font-medium">{forum._count.likes}</span>
                                            </button>

                                            <Link href={`/user/forum/${forum.id}`} className="flex items-center gap-1 hover:text-red-800">
                                                <BiMessageRounded className="w-5 h-5" />
                                                <span>{forum._count.replies} Komentar</span>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    <div className='w-80 space-y-5'>
                        <div className='border border-gray-200 rounded-xl p-6 bg-white'>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCirclePlus className='text-3xl text-red-800' />
                            </div>
                            <div className='text-center mb-4'>
                                <h3 className='font-semibold text-[19px] text-gray-900 mb-2'>Bagikan Cerita Anda</h3>
                                <p className='text-[12px] text-gray-500'>Mulai percakapan baru, ajukan pertanyaan, atau berikan saran</p>
                            </div>
                            <Link href='/user/forumForm'>
                                <button className="w-full bg-red-800 text-white text-[13px] font-medium py-3 px-6 rounded-full hover:bg-red-900 cursor-pointer transition">
                                    Mulai Diskusi Baru
                                </button>
                            </Link>
                        </div>
                        <div className='border border-gray-200 rounded-xl p-6 space-y-5 bg-white'>
                            <div className='flex items-center gap-4'>
                                <Info className='w-8 h-8 text-red-800' />
                                <h1 className='text-red-800 font-semibold'>Pedoman Komunitas</h1>
                            </div>
                            <div>
                                <p className='text-[12px] text-gray-500'>Mari jaga lingkungan ini tetap positif, informatif, dan saling menghormati.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}
