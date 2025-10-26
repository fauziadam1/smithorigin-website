'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { HiOutlineMail as Mail } from 'react-icons/hi';
import { BiUser as User } from 'react-icons/bi';
import { BiLockAlt as Lock } from 'react-icons/bi';
import api from '../../../../lib/axios';
import { saveAuth } from '../../../../lib/auth';
import jwt from 'jsonwebtoken';

interface DecodedUser {
    id: number
    username: string
    email: string
    isAdmin: boolean
}

export default function SignUp() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            setLoading(false)
            return
        }

        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password,
            })

            const accessToken: unknown = response?.data?.data?.accessToken
            if (typeof accessToken !== 'string') {
                throw new Error('Token tidak valid')
            }

            const decoded = jwt.decode(accessToken)

            if (
                decoded &&
                typeof decoded === 'object' &&
                'id' in decoded &&
                'username' in decoded &&
                'email' in decoded &&
                'isAdmin' in decoded
            ) {
                const decodedUser: DecodedUser = {
                    id: decoded.id as number,
                    username: decoded.username as string,
                    email: decoded.email as string,
                    isAdmin: decoded.isAdmin as boolean,
                }

                saveAuth(accessToken, decodedUser)
                router.push('/user')
            } else {
                throw new Error('Data token tidak valid')
            }
        } catch (err: unknown) {
            console.error('Error saat registrasi:', err)

            if (
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response?.data
                    ?.message === 'string'
            ) {
                setError(
                    (err as { response: { data: { message: string } } }).response.data.message,
                )
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Registrasi gagal. Silakan coba lagi.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <section className="container px-10 mx-auto flex items-center justify-center h-screen">
                <div className="flex flex-col gap-7">
                    <div className="text-center space-y-3">
                        <h1 className="text-5xl text-button font-[600]">Create Account</h1>
                        <p className="text-gray-500 text-sm">Register your account to get started</p>
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
                            <label className="absolute top-5 left-5 text-xl cursor-pointer text-gray-400 placeholder:text-gray-200" htmlFor="email">
                                <Mail />
                            </label>
                            <input
                                className="border-2 border-gray-200 py-4 px-4 pl-13 w-full rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent"
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Password (min 6 karakter)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-button text-white text-xl font-[500] w-full py-4 rounded-full cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                    <p className="text-[12px] text-center">
                        You already have an account?{' '}
                        <Link href="/auth/sign-in" className="text-button font-[600] hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}