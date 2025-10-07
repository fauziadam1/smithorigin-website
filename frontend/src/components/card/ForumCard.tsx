'use client'
import { useState } from 'react';
import React from 'react';
import { Button } from '@heroui/button';
import Image from 'next/image';
import { MessageSquare, ThumbsUp, Clock, User, Send } from 'lucide-react';

// Interface - Blueprint untuk tipe data
interface Comment {
    id: number;
    author: string;
    avatar: string;
    timestamp: string;
    text: string;
}

interface Discussion {
    id: number;
    author: string;
    avatar: string;
    category: string;
    timestamp: string;
    title: string;
    content: string;
    likes: number;
    comments: Comment[];
}

interface DiscussionCardProps {
    discussion: Discussion;
    onReply?: (discussionId: number, newComment: Comment) => void;
}

// Komponen Card Diskusi
const DiscussionCard = ({ discussion, onReply }: DiscussionCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [localComments, setLocalComments] = useState(discussion.comments || []);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(discussion.likes || 0);

    const handleSubmitReply = () => {
        if (replyText.trim()) {
            const newComment = {
                id: Date.now(),
                author: 'User Baru',
                text: replyText,
                timestamp: 'Baru saja',
                avatar: '/KeyCaps.jpg'
            };
            setLocalComments([...localComments, newComment]);
            setReplyText('');
            if (onReply) onReply(discussion.id, newComment);
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <Image
                    src={discussion.avatar}
                    alt={discussion.author}
                    width={10}
                    height={10}
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{discussion.author}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{discussion.timestamp}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{discussion.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{discussion.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                        }`}
                >
                    <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>{localComments.length} Komentar</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Existing Comments */}
                    <div className="space-y-3 mb-4">
                        {localComments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                                <Image
                                    src={comment.avatar}
                                    alt={comment.author}
                                    width={10}
                                    height={10}
                                    className="w-8 h-8 rounded-full bg-gray-200"
                                />
                                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Input */}
                    <div className="flex gap-2">
                        <Image
                            src="/KeyCaps.jpg"
                            alt="You"
                            width={10}
                            height={10}
                            className="w-8 h-8 rounded-full bg-gray-200"
                        />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
                                placeholder="Tulis komentar..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={handleSubmitReply}
                                disabled={!replyText.trim()}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Data dummy untuk contoh
const dummyDiscussions = [
    {
        id: 1,
        author: 'Ahmad Rizki',
        avatar: '/KeyCaps.jpg',
        category: 'Tips & Trik',
        timestamp: '2 jam yang lalu',
        title: 'Cara Meningkatkan Skill Mengetik untuk Pemula',
        content: 'Halo semua! Saya ingin berbagi pengalaman bagaimana saya meningkatkan kecepatan mengetik dari 40 WPM menjadi 80 WPM dalam 3 bulan. Ada yang tertarik?',
        likes: 24,
        comments: [
            {
                id: 1,
                author: 'Siti Nurhaliza',
                avatar: '/KeyCaps.jpg',
                timestamp: '1 jam yang lalu',
                text: 'Wah menarik! Boleh share tips-tipsnya dong'
            },
            {
                id: 2,
                author: 'Budi Santoso',
                avatar: '/KeyCaps.jpg',
                timestamp: '30 menit yang lalu',
                text: 'Saya juga pengen belajar nih. Pakai aplikasi apa?'
            }
        ]
    },
    {
        id: 2,
        author: 'Maya Putri',
        avatar: '/KeyCaps.jpg',
        category: 'Pertanyaan',
        timestamp: '5 jam yang lalu',
        title: 'Rekomendasi Keyboard untuk Gaming dan Typing?',
        content: 'Saya lagi cari keyboard yang cocok untuk gaming tapi juga nyaman untuk mengetik. Budget sekitar 500rb-1jt. Ada saran?',
        likes: 15,
        comments: [
            {
                id: 1,
                author: 'Dendi Pratama',
                avatar: '/KeyCaps.jpg',
                timestamp: '4 jam yang lalu',
                text: 'Coba liat mechanical keyboard dengan switch brown, balance antara gaming dan typing'
            }
        ]
    },
    {
        id: 3,
        author: 'Reza Firmansyah',
        avatar: '/KeyCaps.jpg',
        category: 'Pengalaman',
        timestamp: '1 hari yang lalu',
        title: 'Pengalaman Mengikuti Typing Competition Pertama Kali',
        content: 'Kemarin baru aja ikut typing competition pertama kali dan deg-degan banget! Mau share pengalaman seru dan tips buat yang mau ikutan kompetisi.',
        likes: 42,
        comments: []
    }
];

// Main Component
export default function ForumDiscussion() {
    const [discussions, setDiscussions] = useState<Discussion[]>(dummyDiscussions);

    const handleReply = (discussionId: number, newComment: Comment) => {
        console.log(`New reply on discussion ${discussionId}:`, newComment);
        // Di sini nanti bisa ditambahkan logic untuk menyimpan ke backend
    };

    return (
        <div className=" bg-gray-50 p">
            <div className="">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Diskusi Terbaru</h2>
                    <p className="text-sm text-gray-600">
                        {discussions.length} diskusi aktif dalam komunitas
                    </p>
                </div>

                <div className="space-y-4">
                    {discussions.map((discussion) => (
                        <DiscussionCard
                            key={discussion.id}
                            discussion={discussion}
                            onReply={handleReply}
                        />
                    ))}
                </div>

                {/* Empty State (jika tidak ada diskusi) */}
                {discussions.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            Belum ada diskusi
                        </h3>
                        <p className="text-sm text-gray-500">
                            Jadilah yang pertama memulai diskusi di komunitas ini!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}