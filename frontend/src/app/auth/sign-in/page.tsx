'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { BiUser as User, BiLockAlt as Lock } from 'react-icons/bi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiArrowRight } from 'react-icons/hi';
import api from '../../../../lib/axios';
import { saveAuth } from '../../../../lib/auth';
import jwt from 'jsonwebtoken';

interface DecodedUser {
    id: number
    username: string
    email: string
    isAdmin: boolean
}

export default function SignIn() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            })

            const accessToken: unknown = response?.data?.data?.accessToken

            if (typeof accessToken !== 'string') {
                throw new Error('Token tidak valid')
            }

            const decoded = jwt.decode(accessToken)

            if (decoded && typeof decoded === 'object' && 'id' in decoded) {
                const decodedUser = decoded as DecodedUser

                saveAuth(accessToken, decodedUser)

                if (decodedUser.isAdmin) {
                    router.push('/user')
                } else {
                    router.push('/user')
                }
            } else {
                throw new Error('Data token tidak valid')
            }
        } catch (err: unknown) {
            if (
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response === 'object'
            ) {
                const message =
                    (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
                    'Login gagal. Silakan coba lagi.'
                setError(message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Login gagal. Silakan coba lagi.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl border-2 shadow-xl border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-800 to-red-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <User className="w-10 h-10 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                        <p className="text-blue-100 text-sm">Sign in to continue to your account</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-shake">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400"
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400"
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible className="w-5 h-5" />
                                        ) : (
                                            <AiOutlineEye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link 
                                    href="/auth/forgot-password" 
                                    className="text-[14px] font-medium text-gray-500 hover:underline transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-800 to-red-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                            </div>
                        </div>

                        <Link href="/auth/sign-up">
                            <button className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-0.5">
                                Create an Account
                            </button>
                        </Link>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}