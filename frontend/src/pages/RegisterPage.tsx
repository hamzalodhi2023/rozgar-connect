import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { FiUser, FiMail, FiLock, FiBriefcase, FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer';

  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(defaultRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      await register(name, email, password, role);
    } catch (error) {
      // Handled by hook toasts
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-100">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <div className="relative flex items-center">
            <FiUser className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative flex items-center">
            <FiMail className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative flex items-center">
            <FiLock className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-slate-950/40 border border-slate-800 focus:border-violet-500 focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Role Selection Radio Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Your Primary Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Option */}
            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-slate-950/40 hover:border-slate-700/80 transition-all ${
              role === 'customer'
                ? 'border-violet-600 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'border-slate-800 bg-slate-950/20 text-slate-450'
            }`}>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === 'customer'}
                onChange={() => setRole('customer')}
                className="sr-only"
              />
              <FiUser className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Customer</span>
              <span className="text-[10px] text-center mt-1 text-slate-500">Hire services</span>
            </label>

            {/* Worker Option */}
            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-slate-950/40 hover:border-slate-700/80 transition-all ${
              role === 'worker'
                ? 'border-violet-600 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'border-slate-800 bg-slate-950/20 text-slate-450'
            }`}>
              <input
                type="radio"
                name="role"
                value="worker"
                checked={role === 'worker'}
                onChange={() => setRole('worker')}
                className="sr-only"
              />
              <FiBriefcase className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Worker</span>
              <span className="text-[10px] text-center mt-1 text-slate-500">Offer services</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50 mt-2"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
