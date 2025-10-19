import Link from "next/link";
import { HiOutlineMail as Mail } from 'react-icons/hi';
import { BiUser as User } from 'react-icons/bi';
import { BiLockAlt as Lock } from 'react-icons/bi';

export default function SignUp() {
    return (
        <div>
            <section className="container px-10 mx-auto flex items-center justify-center h-screen">
                <div className="flex flex-col gap-7">
                    <div className="text-center space-y-3">
                        <h1 className="text-5xl text-button font-[600]">Create Account</h1>
                        <p className="text-gray-500 text-sm">Register your account to get started</p>
                    </div>
                    <form action="" className="space-y-4 w-110">
                        <div className="relative">
                            <label className="absolute top-5 left-5 text-xl cursor-pointer text-gray-400 placeholder:text-gray-200" htmlFor="username"><User /></label>
                            <input className="border-2 border-gray-200 py-4 px-4 pl-13 w-full rounded-2xl placeholder:text-gray-400" id="username" type="text" placeholder="Username" />
                        </div>
                        <div className="relative">
                            <label className="absolute top-5 left-5 text-xl cursor-pointer text-gray-400 placeholder:text-gray-200" htmlFor="email"><Mail /></label>
                            <input className="border-2 border-gray-200 py-4 px-4 pl-13 w-full rounded-2xl placeholder:text-gray-400" id="email" type="email" placeholder="Email" />
                        </div>
                        <div className="relative">
                            <label className="absolute top-5 left-5 text-xl cursor-pointer text-gray-400" htmlFor="password"><Lock /></label>
                            <input className="border-2 border-gray-200 py-4 px-4 pl-13 w-full rounded-2xl placeholder:text-gray-400" id="password" type="password" placeholder="Password" />
                        </div>
                        <button type="submit" className="bg-button text-white text-xl font-[500] w-full py-4 rounded-full cursor-pointer">Create</button>
                    </form>
                    <p className="text-[12px] text-center">You already have an account? <Link href="/sign-in" className="text-button font-[600]">Sign In</Link></p>
                </div>
            </section>
        </div>
    )
}