'use client'
import Link from 'next/link'
import api from '../../../../lib/axios'
import { getAuth } from '../../../../lib/auth'
import { FiMoreVertical } from 'react-icons/fi'
import { BiMessageRounded } from 'react-icons/bi'
import React, { useState, useEffect } from 'react'
import { getUserColor } from '../../../../utils/color'
import { RiChatNewLine as ChatPlus } from 'react-icons/ri'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsFillKeyboardFill as KeyboardIcon } from 'react-icons/bs'

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

export default function ForumPage() {
    const [forums, setForums] = useState<Forum[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [openMenuId, setOpenMenuId] = useState<number | null>(null) // untuk menu titik tiga
    const { user } = getAuth()

    useEffect(() => {
        fetchForums()
    }, [])

    const fetchForums = async () => {
        try {
            const response = await api.get('/forums?limit=20')
            setForums(response.data.data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memuat forum')
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async (forumId: number) => {
        if (!user) {
            alert('Silakan login untuk like');
            return;
        }

        try {
            const res = await api.post(`/forums/${forumId}/like`);
            const { liked, likeCount } = res.data.data;

            setForums(prev =>
                prev.map(forum => {
                    if (forum.id === forumId) {
                        return {
                            ...forum,
                            likes: liked
                                ? [...(forum.likes ?? []), { userId: user.id }]
                                : (forum.likes ?? []).filter(like => like.userId !== user.id),
                            _count: { ...forum._count, likes: likeCount }
                        };
                    }
                    return forum;
                })
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal like forum');
        }
    };

    const handleDelete = async (forumId: number) => {
        if (!confirm('Yakin ingin menghapus thread ini?')) return;

        try {
            await api.delete(`/forums/${forumId}`);
            setForums(prev => prev.filter(f => f.id !== forumId));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal menghapus thread');
        }
    };

    const handleReport = (forumId: number) => {
        alert(`Melaporkan thread ID: ${forumId}`);
        // Bisa dikembangkan untuk kirim report ke backend
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
        <div className="min-h-fit bg-gray-50 py-40">
            <section className='w-full container mx-auto px-10 flex flex-col gap-10'>
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-4'>
                        <div className="w-16 h-16 bg-red-800 rounded-lg flex items-center justify-center">
                            <KeyboardIcon className='text-3xl text-white' />
                        </div>
                        <div>
                            <h1 className='text-4xl font-[600]'>Forum Komunitas Smith Origin</h1>
                            <p className='text-[13px] text-gray-600'>Platform untuk terhubung dan berbagi pengalaman</p>
                        </div>
                    </div>
                </div>

                <div className='flex items-start gap-5'>
                    <div className='flex-1 flex flex-col gap-5'>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Diskusi Terbaru</h2>
                            <p className="text-sm text-gray-500">{forums.length} diskusi aktif dalam komunitas</p>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-500">{error}</div>
                        ) : forums.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Belum ada diskusi</div>
                        ) : (
                            forums.map((forum) => {
                                const isLiked = user ? forum.likes?.some(like => like.userId === user.id) ?? false : false;
                                const isOwner = user?.id === forum.user.id;
                                const isMenuOpen = openMenuId === forum.id;

                                return (
                                    <div key={forum.id} className='bg-white border rounded-xl p-5 hover:shadow-md transition relative'>
                                        <div className='flex items-start gap-4 mb-3'>
                                            <Link href={`/user/forum/${forum.id}`} className="flex-1 flex items-start gap-4">
                                                <div className={`w-10 h-10 ${getUserColor(forum.user.username)} rounded-full flex items-center justify-center`}>
                                                    <span className="text-sm font-semibold">{forum.user.username[0].toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-sm">{forum.user.username}</span>
                                                        <span className="text-xs text-gray-400">• {formatTime(forum.createdAt)}</span>
                                                    </div>
                                                    <h3 className='text-lg font-semibold text-gray-900 hover:text-button transition cursor-pointer'>
                                                        {forum.title}
                                                    </h3>
                                                </div>
                                            </Link>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(isMenuOpen ? null : forum.id)}
                                                    className="p-1 hover:bg-gray-200 rounded-full"
                                                >
                                                    <FiMoreVertical className="w-5 h-5" />
                                                </button>

                                                {isMenuOpen && (
                                                    <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
                                                        {isOwner && (
                                                            <button
                                                                onClick={() => { handleDelete(forum.id); setOpenMenuId(null); }}
                                                                className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-500"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => { handleReport(forum.id); setOpenMenuId(null); }}
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                                        >
                                                            Laporkan
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <p className='text-sm text-gray-600 line-clamp-2 mb-4 ml-14'>
                                            {forum.content}
                                        </p>

                                        <div className='flex items-center gap-4 ml-14 text-sm text-gray-500'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleLike(forum.id)
                                                }}
                                                className={`flex items-center gap-1 hover:text-red-500 transition ${isLiked ? 'text-red-500' : ''}`}
                                            >
                                                {isLiked ? <AiFillHeart className="w-5 h-5" /> : <AiOutlineHeart className="w-5 h-5" />}
                                                <span className="font-medium">{forum._count.likes}</span>
                                            </button>

                                            <div className="flex items-center gap-1">
                                                <BiMessageRounded className="w-5 h-5" />
                                                <span>{forum._count.replies} Komentar</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className='w-80'>
                        <div className='border rounded-xl p-6 bg-white shadow-sm sticky top-24'>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ChatPlus className='text-3xl text-red-800' />
                            </div>
                            <div className='text-center mb-4'>
                                <h3 className='font-[600] text-[19px] text-gray-900 mb-2'>Bagikan Cerita Anda</h3>
                                <p className='text-[11px] text-gray-600'>Mulai percakapan baru, ajukan pertanyaan, atau berikan saran</p>
                            </div>
                            <Link href='/user/forumForm'>
                                <button className="w-full bg-red-800 text-white text-[13px] font-[500] py-3 px-6 rounded-full hover:bg-red-900 cursor-pointer transition">
                                    Mulai Diskusi Baru
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
