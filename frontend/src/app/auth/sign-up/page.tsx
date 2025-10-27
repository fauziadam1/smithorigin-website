'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { HiOutlineMail as Mail } from 'react-icons/hi';
import { BiUser as User, BiLockAlt as Lock } from 'react-icons/bi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
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
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, text: '', color: '' }
        if (password.length < 6) return { strength: 1, text: 'Weak', color: 'bg-red-500' }
        if (password.length < 10) return { strength: 2, text: 'Medium', color: 'bg-yellow-500' }
        return { strength: 3, text: 'Strong', color: 'bg-green-500' }
    }

    const passwordStrength = getPasswordStrength()

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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <User className="w-10 h-10 text-purple-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-purple-100 text-sm">Join us and start your journey today</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-shake">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder:text-gray-400"
                                        id="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder:text-gray-400"
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder:text-gray-400"
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password (min 6 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        minLength={6}
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

                                {password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full transition-all ${
                                                        level <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            Password strength: <span className="font-semibold">{passwordStrength.text}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-start gap-3">
                                    <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-600">
                                        By creating an account, you agree to our{' '}
                                        <a href="#" className="text-purple-600 hover:underline font-medium">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-purple-600 hover:underline font-medium">Privacy Policy</a>
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
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
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        <Link href="/auth/sign-in">
                            <button className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-0.5">
                                Sign In Instead
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}