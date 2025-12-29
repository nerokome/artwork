'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import type { RootState, AppDispatch } from '@/app/redux/store/store'
import { loginUser } from '@/app/redux/store/userslice'

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { loading, error } = useSelector((state: RootState) => state.user)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreed: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreed) {
      alert('You must agree to the Terms and Privacy Policy')
      return
    }

    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap()

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 relative px-4">
      <Link href="/">
        <div className="fixed top-0 left-0 z-50">
          <Image src="/rarrr.png" alt="Artfolio Logo" width={150} height={150} priority />
        </div>
      </Link>

      <div className="min-h-screen flex items-center justify-center">
        <div
          className="relative z-30 rounded-xl overflow-hidden w-full max-w-2xl"
          style={{
            backgroundImage: "url('/fotos.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="animated-border p-[1px] rounded-3xl">
            <div className="relative z-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-light text-white mb-6">
                  Login to Artfolio
                </h1>
                <h2 className="text-xl font-semibold text-white">Login</h2>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-colors"
                  required
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-colors"
                  required
                />

                <div className="flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                  <label className="text-sm text-gray-300">
                    I agree to the <span className="underline">Terms</span> and{' '}
                    <span className="underline">Privacy Policy</span>
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-400">
                    {error.message || 'Login failed'}
                  </p>
                )}

                <p className="text-sm text-gray-400">
                  Don’t have an account?{' '}
                  <Link href="/auth/signup" className="text-cyan-400 underline">
                    Signup
                  </Link>
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-1/2 mx-auto py-3 rounded-2xl border-2 border-cyan-400/60 text-white font-medium
                             hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
                             transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Logging in…' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
