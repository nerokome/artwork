'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '@/app/redux/store/userslice';
import { RootState, AppDispatch } from '@/app/redux/store/store';
import { User, Mail, Lock, Loader2, ArrowLeft, UserPlus } from 'lucide-react';

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) return;

    try {
      await dispatch(
        signupUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-cyan-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <Link href="/" className="fixed top-8 left-8 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="relative group">
          
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
          
            <div className="flex flex-col items-center text-center mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Image src="/rarrr.png" alt="Artfolio Logo" width={50} height={50} className="h-10 w-auto brightness-125" priority />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Join Artfolio</h1>
              <p className="text-slate-400 mt-2 text-sm">The canvas for your digital legacy.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                    placeholder="John Doe" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-11 py-3.5 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all" 
                    required 
                  />
                </div>
              </div>

              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="artist@artfolio.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-11 py-3.5 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all" 
                    required 
                  />
                </div>
              </div>

             
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-11 py-3.5 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all" 
                    required 
                  />
                
                  <div 
                    onClick={() => setShowPassword((prev) => !prev)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.018.159-2.005.462-2.937M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A3 3 0 0112 15m0-3a3 3 0 013-3M12 19c5.523 0 10-4.477 10-10 0-1.018-.159-2.005-.462-2.937" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" name="agreed" id="terms" 
                  checked={formData.agreed} onChange={handleChange}
                  className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 checked:bg-cyan-500 checked:border-cyan-500 transition-all focus:ring-0" 
                />
                <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none">
                  I agree to the <span className="text-white hover:underline">Terms</span> and <span className="text-white hover:underline">Privacy Policy</span>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-pulse">
                  {error.message || 'Signup failed. Please try again.'}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !formData.agreed} 
                className="group relative w-full py-4 rounded-2xl bg-cyan-500 text-black font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-40 active:scale-[0.97]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Create Account <UserPlus size={18} /></>
                  )}
                </span>
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              <div className="text-center pt-4">
                <p className="text-slate-500 text-xs">
                  Already have an account? <Link href="/auth/login" className="text-white font-bold hover:text-cyan-400 transition-colors">Log In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
