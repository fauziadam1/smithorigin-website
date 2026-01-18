'use client'
import Link from 'next/link'
import api from '../../../lib/axios'
import { useRouter } from 'next/navigation'
import { BiMessageRounded } from 'react-icons/bi'
import React, { useState, useEffect } from 'react'
import { getUserColor } from '../../../utils/color'
import { useAlert } from '@/app/components/ui/alert'
import { useConfirm } from '@/app/components/ui/confirm'
import { useAuth } from '@/app/components/ui/authcontext'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { Info, MessageCircleMore, MessageCirclePlus, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

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
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 animate-pulse">
            <div className="flex items-start gap-3 md:gap-4 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full" />

                <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-3 bg-gray-200 rounded" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="ml-11 md:ml-14 space-y-2">
                <div className="w-full h-3 bg-gray-200 rounded" />
                <div className="w-2/3 h-3 bg-gray-200 rounded" />
            </div>

            <div className="ml-11 md:ml-14 flex items-center gap-4 mt-4">
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
    const { user } = useAuth()

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

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
            const response = await api.get('/forums?limit=100')
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
            setTimeout(() => router.push('/auth/login'), 3000)
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

    const canDelete = (createdAt: string): boolean => {
        const now = new Date()
        const created = new Date(createdAt)
        const diffMs = now.getTime() - created.getTime()
        const diffHours = diffMs / 3600000
        return diffHours <= 1
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

    const goToPage = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const Pagination = ({ totalPages }: { totalPages: number }) => {
        if (forums.length <= itemsPerPage) return null

        const getPageNumbers = () => {
            const pages = []
            const maxVisible = 5

            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i)
                    pages.push('...')
                    pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    pages.push('...')
                    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
                } else {
                    pages.push(1)
                    pages.push('...')
                    pages.push(currentPage - 1)
                    pages.push(currentPage)
                    pages.push(currentPage + 1)
                    pages.push('...')
                    pages.push(totalPages)
                }
            }

            return pages
        }

        return (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 md:mt-8">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 rounded-lg border cursor-pointer border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400 text-sm">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page as number)}
                            className={`min-w-8 h-8 sm:min-w-10 sm:h-10 px-2 sm:px-3 rounded-lg font-medium cursor-pointer transition text-sm ${currentPage === page
                                ? 'bg-red-800 text-white'
                                : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 sm:p-2 rounded-lg border cursor-pointer border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        )
    }

    const renderForumList = () => {
        if (loading) {
            return (
                <div className="flex flex-col gap-4 md:gap-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <ForumSkeleton key={i} />
                    ))}
                </div>
            )
        }

        if (error) {
            return <div className="text-center py-10 text-red-500 text-sm md:text-base">{error}</div>
        }

        if (forums.length === 0) {
            return (
                <div className="flex items-center justify-center mt-20 md:mt-50">
                    <div className="text-center text-gray-500">
                        <h1 className='font-medium text-sm md:text-base'>Belum ada diskusi</h1>
                        <p className='text-xs'>Jadilah yang pertama</p>
                    </div>
                </div>
            )
        }

        const totalPages = Math.ceil(forums.length / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const currentForums = forums.slice(startIndex, endIndex)

        return (
            <>
                {currentForums.map((forum) => {
                    const isLiked = user ? forum.likes?.some(like => like.userId === user.id) ?? false : false;
                    const isOwner = user?.id === forum.user.id;
                    const isDeletable = isOwner && canDelete(forum.createdAt);

                    return (
                        <div key={forum.id} className='bg-white border border-gray-200 rounded-xl hover:shadow-md transition relative'>
                            <div className='flex items-start gap-3 md:gap-4 border-b border-gray-200 p-4 md:p-5 bg-red-100/20'>
                                <div className="flex-1 flex items-start gap-3 md:gap-4">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 ${getUserColor(forum.user.username)} rounded-full flex items-center justify-center shrink-0`}>
                                        <span className="text-xs md:text-sm font-semibold">{forum.user.username[0].toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-xs md:text-sm">{forum.user.username}</span>
                                        <span className="text-[10px] md:text-xs flex items-center gap-1 text-gray-400">
                                            <Clock className='w-3 h-3' />
                                            {formatTime(forum.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                {isDeletable && (
                                    <button
                                        onClick={() => handleDelete(forum.id)}
                                        className="p-1.5 md:p-2 hover:bg-red-100 cursor-pointer rounded-full text-red-500 transition shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                )}
                            </div>

                            <Link href={`/user/forum/${forum.id}`} className='border-b border-gray-200 p-4 md:p-5 flex flex-col gap-2'>
                                <h3 className='md:text-lg lg:text-xl font-semibold  text-gray-900 hover:text-red-800 transition cursor-pointer truncate'>
                                    {forum.title}
                                </h3>
                                <p className='text-xs md:text-sm text-gray-600 line-clamp-2 truncate'>
                                    {forum.content}
                                </p>
                            </Link>

                            <div className='flex items-center gap-3 md:gap-4 p-4 md:p-5 text-xs md:text-sm text-gray-500'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleLike(forum.id)
                                    }}
                                    className={`flex items-center gap-1 cursor-pointer hover:text-red-800 transition ${isLiked ? 'text-red-800' : ''}`}
                                >
                                    {isLiked ? <AiFillHeart className="w-4 h-4 md:w-5 md:h-5" /> : <AiOutlineHeart className="w-4 h-4 md:w-5 md:h-5" />}
                                    <span className="font-medium">{forum._count.likes}</span>
                                </button>

                                <Link href={`/user/forum/${forum.id}`} className="flex items-center gap-1 hover:text-red-800">
                                    <BiMessageRounded className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>{forum._count.replies} Komentar</span>
                                </Link>
                            </div>
                        </div>
                    )
                })}

                <Pagination totalPages={totalPages} />
            </>
        )
    }

    return (
        <div className="min-h-screen mt-24 md:mt-32 lg:mt-40">
            <section className='w-full container mx-auto px-4 md:px-6 lg:px-10 flex flex-col gap-6 md:gap-8 lg:gap-10'>
                <div className='flex flex-col gap-3'>
                    <div className='space-y-2 md:space-y-3'>
                        <div className="flex items-center gap-3 md:gap-4">
                            <MessageCircleMore className='w-8 h-8 md:w-10 md:h-10 text-red-800' />
                            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Forum Komunitas Smith Origin</h1>
                        </div>
                        <div className='space-y-2'>
                            <p className='text-xs md:text-[13px] text-gray-600'>Platform untuk terhubung dan berbagi pengalaman</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-10'>
                    <div className='w-full lg:flex-1 min-w-0 flex flex-col gap-4 md:gap-5'>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h2 className="text-lg md:text-xl font-semibold">Diskusi terbaru</h2>
                            {!loading && <p className="text-xs md:text-sm text-gray-500">{forums.length} Diskusi aktif</p>}
                        </div>

                        {renderForumList()}
                    </div>

                    <div className='w-full lg:w-80 shrink-0 space-y-4 md:space-y-5'>
                        <div className='border border-gray-200 rounded-xl p-5 md:p-6 bg-white'>
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <MessageCirclePlus className='text-2xl md:text-3xl text-red-800' />
                            </div>
                            <div className='text-center mb-3 md:mb-4'>
                                <h3 className='font-semibold text-base md:text-[19px] text-gray-900 mb-2'>Bagikan Cerita Anda</h3>
                                <p className='text-[11px] md:text-[12px] text-gray-500'>Mulai percakapan baru, ajukan pertanyaan, atau berikan saran</p>
                            </div>
                            <Link href='/user/forumForm'>
                                <button className="w-full bg-red-800 text-white text-xs md:text-[13px] font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-full hover:bg-red-900 cursor-pointer transition">
                                    Mulai Diskusi Baru
                                </button>
                            </Link>
                        </div>

                        {!loading && forums.length > 0 && (
                            <div className='border border-gray-200 rounded-xl p-5 md:p-6 bg-white space-y-3 md:space-y-4'>
                                <h3 className='font-semibold text-sm md:text-base text-gray-900 flex items-center gap-2'>
                                    <span className='text-red-800'>🔥</span> Diskusi Trending
                                </h3>
                                <div className='space-y-2 md:space-y-3'>
                                    {forums
                                        .sort((a, b) => (b._count.likes + b._count.replies) - (a._count.likes + a._count.replies))
                                        .slice(0, 5)
                                        .map((forum, index) => (
                                            <Link
                                                key={forum.id}
                                                href={`/user/forum/${forum.id}`}
                                                className='block p-2.5 md:p-3 rounded-lg hover:bg-gray-50 hover:border-gray-200 transition border border-gray-100'
                                            >
                                                <div className='flex items-start gap-2 md:gap-3'>
                                                    <span
                                                        className={`text-base md:text-lg font-bold min-w-5 md:min-w-6 ${index === 0 && 'text-yellow-500'} ${index === 1 && 'text-blue-500'} ${index === 2 && 'text-red-500'} ${index > 2 && 'text-gray-300'}`}>
                                                        {index + 1}
                                                    </span>

                                                    <div className='flex-1 min-w-0'>
                                                        <h4 className='text-[12px] md:text-[13px] font-medium text-gray-900 line-clamp-2 hover:text-red-800 transition'>
                                                            {forum.title}
                                                        </h4>
                                                        <div className='flex items-center gap-2 md:gap-3 mt-1.5 md:mt-2 text-[10px] md:text-[11px] text-gray-500'>
                                                            <span className='flex items-center gap-1'>
                                                                <AiOutlineHeart className='w-3 h-3' />
                                                                {forum._count.likes}
                                                            </span>
                                                            <span className='flex items-center gap-1'>
                                                                <BiMessageRounded className='w-3 h-3' />
                                                                {forum._count.replies}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div className='border border-gray-200 rounded-xl p-5 md:p-6 space-y-4 md:space-y-5 bg-white'>
                            <div className='flex items-center gap-3 md:gap-4'>
                                <Info className='w-6 h-6 md:w-8 md:h-8 text-red-800' />
                                <h1 className='text-red-800 font-semibold text-sm md:text-base'>Pedoman Komunitas</h1>
                            </div>
                            <div>
                                <p className='text-[11px] md:text-[12px] text-gray-500'>Mari jaga lingkungan ini tetap positif, informatif, dan saling menghormati.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}