'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { PiSignInBold as Signin } from 'react-icons/pi';
import { BiUser as User } from 'react-icons/bi';
import { BiLockAlt as Lock } from 'react-icons/bi';
import api from '../../../../lib/axios';
import { saveAuth } from '../../../../lib/auth';
import jwt from 'jsonwebtoken';

export default function SignIn() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });

            const { accessToken } = response.data.data;

            // Decode JWT untuk dapat user info
            const decoded: any = jwt.decode(accessToken);

            if (decoded) {
                const user = {
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email,
                    isAdmin: decoded.isAdmin,
                };

                saveAuth(accessToken, user);

                // Redirect berdasarkan role
                if (user.isAdmin) {
                    router.push('/user');
                } else {
                    router.push('/user');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="container px-10 mx-auto flex items-center justify-center h-screen">
                <div className="flex flex-col gap-7">
                    <div className="text-center space-y-5">
                        <h1 className="text-5xl text-button font-[600]">Login</h1>
                        <p className="text-gray-500 text-sm">Masukkan detail anda untuk masuk ke akun</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 w-110">
                        <div className="relative">
                            <label className="absolute top-5 left-5 text-xl cursor-pointer text-gray-400 placeholder:text-gray-200" htmlFor="username">
                                <User />
                            </label>
                            <input
                                className="border-2 border-gray-200 py-4 px-4 pl-13 w-full rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent"
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute top-5 left-5 text-xl cursor-pointer text-gray-400" htmlFor="password">
                                <Lock />
                            </label>
                            <input
                                className="border-2 border-gray-200 py-4 px-4 pl-13 w-full rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent"
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-button text-white text-xl font-[500] w-full py-4 rounded-full cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                    <p className="text-[12px] text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/sign-up" className="text-button font-[600] hover:underline">
                            SignUp
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}